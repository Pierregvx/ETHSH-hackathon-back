// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.14;

import 'protocol/packages/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol';

interface IPUSHCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

contract umaInteract {
    // Create an Optimistic oracle instance at the deployed address on Görli.
    OptimisticOracleV2Interface oo = OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);
    //mumbai 0x60E6140330F8FE31e785190F39C1B5e5e833c2a9
    // goerli 0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884
    //optimism 0x255483434aba5a75dc60c1391bB162BCd9DE2882
    // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.
    bytes32 identifier = bytes32('YES_OR_NO_QUERY');

    // Post the question in ancillary data. Note that this is a simplified form of ancillry data to work as an example. A real
    // world prodition market would use something slightly more complex and would need to conform to a more robust structure.
    enum State {
        NOT_INITIALISATED,
        SUBMITED,
        VOTE_ONGOING,
        REFUSED,
        ACCEPTED
    }
    struct Proposal {
        uint256 time;
        bytes data;
    }

    struct Deployment {
        address DAOaddress;
        string IPFShash;
        State state;
        Proposal lastProposal;
    }

    event ProposalUpdated(address DAOaddress, string IPFSHash, State State);
    event DaoRegistered(address DAOAddress);
    mapping(string => Deployment) public propDetails;

    uint256 requestTime = 0; // Store the request time so we can re-use it later.

    function submitDeployment(string memory hash, address DAOaddress) public {
        bytes memory data;
        propDetails[hash] = Deployment(DAOaddress, hash, State.SUBMITED, Proposal(0, data));
    }

    function getProposalQuestion(string memory IPFSHash) internal pure returns (bytes memory) {
        return bytes(string.concat(IPFSHash, ' : 0 to accept this front end - else 1 '));
    }

    // Submit a data request to the Optimistic oracle.
    function requestData(string memory IPFSHash) public {
        bytes memory ancillaryData = getProposalQuestion(IPFSHash);
        requestTime = block.timestamp; // Set the request time to the current block time.
        IERC20 bondCurrency = IERC20(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6); // Use Görli WETH as the bond currency.

        //mumbai 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
        //goerli 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        //polygon 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
        //opt 0x4200000000000000000000000000000000000006

        uint256 reward = 0; // Set the reward to 0 (so we dont have to fund it from this contract).

        // Now, make the price request to the Optimistic oracle and set the liveness to 30 so it will settle quickly.
        oo.requestPrice(identifier, requestTime, ancillaryData, bondCurrency, reward);
        oo.setCustomLiveness(identifier, requestTime, ancillaryData, 30);
        propDetails[IPFSHash].state = State.VOTE_ONGOING;
        propDetails[IPFSHash].lastProposal = Proposal(requestTime, ancillaryData);
        emit ProposalUpdated(propDetails[IPFSHash].DAOaddress,IPFSHash, State.VOTE_ONGOING);
        IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
            0x7FC5f4f5bE07b698365DA975218909195404eF89,
            address(this),
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        '0', // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        '+', // segregator
                        '1', // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        '+', // segregator
                        'new request for hash', // this is notificaiton title
                        '+', // segregator
                        string.concat(IPFSHash, ' you can vote in favour or again this front end deployment') // notification body
                    )
                )
            )
        );
    }

    // Settle the request once it's gone through the liveness period of 30 seconds. This acts the finalize the voted on price.
    // In a real world use of the Optimistic Oracle this should be longer to give time to disputers to catch bat price proposals.
    function settleRequest(string memory IPFSHash) public {
        Proposal storage prop = propDetails[IPFSHash].lastProposal;
        oo.settle(address(this), identifier, prop.time, prop.data);
        updatePropState(IPFSHash);
    }

    // Fetch the resolved price from the Optimistic Oracle that was settled.
    function getSettledData(string memory IPFSHash) public view returns (int256) {
        Proposal memory prop = propDetails[IPFSHash].lastProposal;
        return oo.getRequest(address(this), identifier, prop.time, prop.data).resolvedPrice;
    }

    function updatePropState(string memory IPFSHash) public {
        if (propDetails[IPFSHash].lastProposal.time == 0) return;
        int256 result = getSettledData(IPFSHash);
        State newState = State.REFUSED;
        if (result == 0) newState = State.ACCEPTED;
        propDetails[IPFSHash].state = newState;
        emit ProposalUpdated(propDetails[IPFSHash].DAOaddress,IPFSHash, newState);
        string memory response = newState == State.ACCEPTED ? 'accepted ' : 'refused';
        IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
            0x7FC5f4f5bE07b698365DA975218909195404eF89,
            address(this),
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        '0', // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        '+', // segregator
                        '1', // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        '+', // segregator
                        'request settled', // this is notificaiton title
                        '+', // segregator
                        string.concat(IPFSHash, ' has been', response) // notification body
                    )
                )
            )
        );
    }
}
