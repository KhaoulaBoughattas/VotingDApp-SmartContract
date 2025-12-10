# 🗳 Voting DApp

A decentralized voting application (DApp) built on Ethereum, allowing users to vote for candidates securely. The project includes a smart contract written in Solidity, deployment scripts with Hardhat, and a React frontend.

---

## **Features**
- Add candidates (owner only)
- Cast a vote (one vote per address)
- Close voting (owner only)
- View total votes and candidates
- Display winner after voting closes

---

## **Technologies Used**
- **Solidity**: Smart contract programming
- **Hardhat**: Ethereum development environment
- **Ethers.js**: Interacting with Ethereum blockchain
- **React.js**: Frontend UI
- **MetaMask**: Ethereum wallet for testing

---

## **Folder Structure**
VotingDApp/
│
├─ contracts/ # Solidity smart contract
│ └─ Voting.sol
│
├─ scripts/ # Deployment scripts
│ └─ deploy.js
│
├─ frontend/ # React frontend
│ └─ App.js
│
├─ package.json # Node project configuration
├─ hardhat.config.js # Hardhat configuration
└─ README.md

---

## **Installation & Setup**

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/VotingDApp-SmartContract.git
cd VotingDApp-SmartContract
```
2. Install dependencies:
```bash
npm install
```
3.Compile smart contracts:
```bash
npx hardhat compile
```
4.Start a local blockchain:
```bash
npx hardhat node
```
5.Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
6.Run the frontend:
```bash
cd voting-frontend
npm start
```
Open http://localhost:3000
 to see the app.
-------------------------------------------
## Usage

- Connect MetaMask to localhost network

- Vote for a candidate

- Owner can add candidates and close voting

- After voting closes, winner can be retrieved





















