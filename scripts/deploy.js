// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying contract from:", deployer.address);

  const candidateNames = ["Alice", "Bob", "Charlie"];

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames);

  await voting.waitForDeployment();

  console.log("📌 Contract deployed at:", await voting.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
