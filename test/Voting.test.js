// test/Voting.test.js

const { expect } = require("chai");
const hre = require("hardhat");

describe("Voting contract", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    Voting = await hre.ethers.getContractFactory("Voting");
    voting = await Voting.deploy(["Alice", "Bob"]);

    await voting.waitForDeployment(); // Hardhat v3 + Ethers v6
  });

  it("should initialize candidates correctly", async function () {
    const candidate0 = await voting.getCandidate(0);
    expect(candidate0.name).to.equal("Alice");
    expect(candidate0.voteCount).to.equal(0);

    const candidate1 = await voting.getCandidate(1);
    expect(candidate1.name).to.equal("Bob");
    expect(candidate1.voteCount).to.equal(0);
  });

  it("should allow voting and prevent double voting", async function () {
    await voting.connect(addr1).vote(0);

    const candidate0 = await voting.getCandidate(0);
    expect(candidate0.voteCount).to.equal(1);

    await expect(
      voting.connect(addr1).vote(1)
    ).to.be.revertedWith("You have already voted");
  });

  it("should emit Voted event", async function () {
    await expect(voting.connect(addr2).vote(1))
      .to.emit(voting, "Voted")
      .withArgs(1, addr2.address);
  });
});
