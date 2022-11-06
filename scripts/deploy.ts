import { ethers } from "hardhat";

async function main() {

  const Lock = await ethers.getContractFactory("frontProposal");
  //"0x2Ff10419Fd92498b1143a96Aa0374E9d247B7CBA" mumbai
  const lock = await Lock.attach("0x2Ff10419Fd92498b1143a96Aa0374E9d247B7CBA");
  const accounts = await ethers.getSigners()
  await lock.deployed();
  console.log(lock.address)
  await lock.whitelist("0x7A26CAbECf8a75D60BFa568F798D988F646048A9")
  // await lock.whitelist(accounts[3].address)
  // await lock.connect(accounts[3]).proposeFirstFront("https://djkscdfhjeks4r6H8j98g345.ipns.dweb.link/")  
  // await lock.connect(accounts[5]).proposeFirstFront("https://k51qzi5uqu5dgc7jdelv14mcma76yen9kaupekf5yhdncsrjuyn7hvxom4ig0u.ipns.dweb.link/")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
