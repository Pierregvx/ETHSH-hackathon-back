pragma solidity ^0.8.14;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract frontProposal is ERC721URIStorage {
    address owner;
    /// @dev Whether a nullifier hash has been used already. Used to prevent double-signaling
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => bool) isUserWhitelisted;
    address umaCall;
    uint256 counter = 1;
/// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();
    constructor() ERC721('FRONT_PROPOSAL', 'ftp') {
        owner = msg.sender;
    }

    function proposeFirstFront(string memory hashIPFS,uint256 nullifierHash) public {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
        
        require(isUserWhitelisted[msg.sender]);
        require(IERC721(address(this)).balanceOf(msg.sender)==0,"already own an nft");
        _mint(msg.sender, counter);
        proposeNewFront(hashIPFS,counter);
        counter++;
    }

    function proposeNewFront(string memory hashIPFS,uint256 tokenID) public {
        require(msg.sender == IERC721(address(this)).ownerOf(tokenID),"not nft owner");
        _setTokenURI(tokenID, hashIPFS);
    }
}
