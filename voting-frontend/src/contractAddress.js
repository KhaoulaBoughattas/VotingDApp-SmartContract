
const network = process.env.REACT_APP_NETWORK || "localhost";

const CONTRACT_ADDRESSES = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // adresse du contrat local
};

export const VOTING_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[network];
