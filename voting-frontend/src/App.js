// App.js

import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import Voting from "./contracts/Voting.json";
import { VOTING_CONTRACT_ADDRESS } from "./contractAddress";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");

  const [candidates, setCandidates] = useState(["Alice", "Bob"]); // 🔥 FIXED (fixed candidates)
  const [votes, setVotes] = useState([0, 0]);
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const [hasVoted, setHasVoted] = useState(false);
  const [votingActive, setVotingActive] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------
  // 🔹 Load blockchain (provider, signer, contract)
  // ------------------------------------------------------
  const loadBlockchain = useCallback(async () => {
    if (!window.ethereum) return alert("⚠️ Please install MetaMask!");

    try {
      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);

      const _signer = await _provider.getSigner();
      const userAddress = await _signer.getAddress();

      const _contract = new Contract(
        VOTING_CONTRACT_ADDRESS,
        Voting.abi,
        _signer
      );

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setConnectedAddress(userAddress);

      await loadData(_contract, userAddress);
    } catch (error) {
      console.error("❌ Error loading blockchain:", error);
      alert("Failed to load contract or connect wallet.");
    }
  }, []);

  // ------------------------------------------------------
  // 🔹 Load votes & user status
  // ------------------------------------------------------
  const loadData = useCallback(async (contract, userAddress) => {
    try {
      // 🔥 We load only Alice(0) and Bob(1)
      const vAlice = Number((await contract.candidates(0)).voteCount);
      const vBob = Number((await contract.candidates(1)).voteCount);

      const newVotes = [vAlice, vBob];
      setVotes(newVotes);

      const total = vAlice + vBob;
      setTotalVotes(total);

      const voted = await contract.voters(userAddress);
      setHasVoted(voted);

      const active = contract.isVotingActive
        ? await contract.isVotingActive()
        : true;

      setVotingActive(active);
    } catch (error) {
      console.error("❌ Error loading data:", error);
    }
  }, []);

  // ------------------------------------------------------
  // 🔹 Initial load
  // ------------------------------------------------------
  useEffect(() => {
    loadBlockchain();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, [loadBlockchain]);

  // ------------------------------------------------------
  // 🔹 Vote function
  // ------------------------------------------------------
  const vote = async () => {
    if (!selectedCandidate) return alert("Choose a candidate.");

    const index = selectedCandidate === "Alice" ? 0 : 1;

    setLoading(true);

    try {
      const tx = await contract.vote(index);
      await tx.wait();

      const updatedVotes = [...votes];
      updatedVotes[index]++;

      setVotes(updatedVotes);
      setHasVoted(true);
      setTotalVotes(totalVotes + 1);

      alert(`🗳️ Vote submitted for ${selectedCandidate}!`);
    } catch (err) {
      console.error(err);
      alert("❌ Error: transaction failed.");
    }

    setLoading(false);
  };

  // ------------------------------------------------------
  // 🔹 UI
  // ------------------------------------------------------
  return (
    <div
      style={{
        fontFamily: "Poppins",
        padding: "40px",
        minHeight: "100vh",
        background: "#f5f6fa",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#6c5ce7" }}>
        🗳 Local Voting DApp
      </h1>

      {connectedAddress && (
        <p style={{ textAlign: "center", opacity: 0.8 }}>
          Connected: {connectedAddress.slice(0, 6)}...
          {connectedAddress.slice(-4)}
        </p>
      )}

      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: votingActive ? "#00b894" : "#d63031",
        }}
      >
        {votingActive ? "Voting is ACTIVE" : "Voting is CLOSED"}
      </p>

      {/* Candidates */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {candidates.map((name, idx) => {
          const pct = totalVotes
            ? ((votes[idx] / totalVotes) * 100).toFixed(1)
            : 0;

          return (
            <div
              key={idx}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{name}</h3>
              <p>{votes[idx]} votes</p>

              <div
                style={{
                  height: "12px",
                  background: "#dfe6e9",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    background: "#6c5ce7",
                    height: "100%",
                    borderRadius: "6px",
                  }}
                ></div>
              </div>

              <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>{pct}%</p>
            </div>
          );
        })}
      </div>

      {/* Vote */}
      {!hasVoted && votingActive && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="">Choose a candidate</option>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>

          <button
            onClick={vote}
            disabled={loading}
            style={{
              background: "#6c5ce7",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Voting..." : "Vote"}
          </button>
        </div>
      )}

      {hasVoted && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#0984e3",
            fontWeight: "bold",
          }}
        >
          ✅ You have already voted
        </p>
      )}

      <p
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontWeight: "bold",
        }}
      >
        Total votes: {totalVotes}
      </p>
    </div>
  );
}

export default App;
