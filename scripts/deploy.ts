import { ethers } from "hardhat";

async function main() {

  const Lock = await ethers.getContractFactory("frontProposal");
  const lock =  Lock.attach("0x06335e609F2985E2FA68494FF7d167501E7d7204");
const accounts = await ethers.getSigners()
  // await lock.deployed();
  console.log(lock.address)
  await lock.whitelist(accounts[1].address)  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
