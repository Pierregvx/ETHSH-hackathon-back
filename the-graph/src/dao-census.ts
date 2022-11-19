import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import { DAOCensus, ProposalUpdated, DaoRegistered } from '../generated/DAOCensus/DAOCensus';
import { Dao, Deployment, Proposal } from '../generated/schema';

export function handleDaoRegistered(event: DaoRegistered): void {
  const dao = new Dao(event.params.DAOAddress.toHexString());
  dao.save();
}
const states = ['NOT_INITIALISATED', 'SUBMITED', 'VOTE_ONGOING', 'REFUSED', 'ACCEPTED'];

export function handleProposalUpdated(event: ProposalUpdated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let proposal = new Proposal(event.transaction.hash.toHexString());
  proposal.time = event.block.timestamp;
  proposal.data = 'to change for the graph';
  proposal.result = states[event.params.State];
  
  let deployment = Deployment.load(event.params.IPFSHash);
  if (!deployment) {
    deployment = new Deployment(event.params.IPFSHash);
    deployment.dao = event.params.DAOaddress.toHexString();
    deployment.timeCreated = event.block.timestamp;
  }  
  deployment.state = states[event.params.State];

  proposal.deployment = deployment.id;
  proposal.save();
  deployment.save();
}
