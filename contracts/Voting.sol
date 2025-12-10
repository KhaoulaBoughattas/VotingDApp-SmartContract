// SPDX-License-Identifier: MIT
// Licence open-source autorisant l’utilisation libre du code.
pragma solidity ^0.8.28;
// On utilise Solidity version 0.8.28 (version sécurisée incluant vérification des débordements).


// ---------------------------------------------------------
// DÉBUT DU CONTRAT Voting
// ---------------------------------------------------------
contract Voting {

    // -----------------------------------------------------
    // STRUCTURE DES CANDIDATS
    // -----------------------------------------------------

    struct Candidate {
        uint id;            // Identifiant unique du candidat (0,1,2...) 
        string name;        // Nom du candidat (ex: "Alice")
        uint voteCount;     // Nombre total de votes reçus
    }

    // -----------------------------------------------------
    // VARIABLES ET STOCKAGE
    // -----------------------------------------------------

    mapping(uint => Candidate) public candidates;
    // Mapping (clé → valeur) : l’ID renvoie à un Candidate complet

    mapping(address => bool) public voters;
    // Mapping (adresse Ethereum → bool) pour vérifier si une adresse a déjà voté

    uint public candidatesCount;
    // Nombre total de candidats enregistrés

    address public owner;
    // Adresse de la personne qui déploie le contrat (admin)

    bool public votingOpen = true;
    // État du vote : true = ouvert, false = fermé


    // -----------------------------------------------------
    // ÉVÉNEMENTS (utiles pour le front-end)
    // -----------------------------------------------------

    event Voted(uint candidateId, address voter);
    // Événement déclenché quand quelqu’un vote

    event CandidateAdded(uint id, string name);
    // Événement déclenché quand un candidat est ajouté

    event VotingClosed();
    // Événement déclenché quand le vote est fermé


    // -----------------------------------------------------
    // MODIFICATEURS (conditions pour certaines fonctions)
    // -----------------------------------------------------

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        // Vérifie que l’appelant est bien le propriétaire
        _;
        // Continue l’exécution de la fonction
    }

    modifier voteIsOpen() {
        require(votingOpen == true, "Voting is closed");
        // Vérifie que le vote est ouvert
        _;
    }


    // -----------------------------------------------------
    // CONSTRUCTEUR (s’exécute au déploiement)
    // -----------------------------------------------------
    
    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        // L’adresse qui déploie devient propriétaire

        // Boucle pour enregistrer les candidats passés au déploiement
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates[i] = Candidate(i, candidateNames[i], 0);
            // On crée un nouveau candidat avec :
            // - id = i
            // - name = candidateNames[i]
            // - voteCount = 0

            candidatesCount++;
            // Incrémente le nombre de candidats
        }
    }


    // -----------------------------------------------------
    // FONCTION VOTER
    // -----------------------------------------------------

    function vote(uint candidateId) public voteIsOpen {
        // Cette fonction peut être utilisée seulement si le vote est ouvert

        require(!voters[msg.sender], "You have already voted");
        // Empêche de voter deux fois

        require(candidateId < candidatesCount, "Invalid candidate ID");
        // Vérifie que le candidat existe

        voters[msg.sender] = true;
        // Marque cette adresse comme ayant voté

        candidates[candidateId].voteCount++;
        // Incrémente le compteur de votes du candidat

        emit Voted(candidateId, msg.sender);
        // Envoie un événement pour que le front-end mette à jour l’UI
    }


    // -----------------------------------------------------
    // AJOUTER UN CANDIDAT (seulement owner)
    // -----------------------------------------------------

    function addCandidate(string memory name) public onlyOwner voteIsOpen {
        // onlyOwner = seul le déployeur peut ajouter
        // voteIsOpen = seulement si vote pas encore fermé

        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        // Nouveau candidat avec :
        // - ID = candidatesCount
        // - Name = name
        // - voteCount = 0

        emit CandidateAdded(candidatesCount, name);
        // Émet événement pour mettre à jour UI

        candidatesCount++;
        // Incrémente le nombre de candidats
    }


    // -----------------------------------------------------
    // FERMER LE VOTE (owner uniquement)
    // -----------------------------------------------------

    function closeVoting() public onlyOwner {
        votingOpen = false;
        // Le vote est maintenant fermé

        emit VotingClosed();
        // Prévenir le front-end
    }


    // -----------------------------------------------------
    // RÉCUPÉRER INFO D’UN CANDIDAT
    // -----------------------------------------------------

    function getCandidate(uint candidateId) public view returns (Candidate memory) {
        return candidates[candidateId];
        // Retourne les informations du candidat sélectionné
    }


    // -----------------------------------------------------
    // OBTENIR LE GAGNANT
    // -----------------------------------------------------

    function getWinner() public view returns (string memory winnerName, uint winnerVotes) {
        require(!votingOpen, "Voting must be closed to get the winner");
        // On ne peut pas obtenir le gagnant si le vote est encore en cours

        uint maxVotes = 0;
        // Variable temporaire pour stocker le maximum de votes

        uint winnerId = 0;
        // Variable pour stocker l’ID du gagnant

        // Boucle sur tous les candidats pour trouver celui avec le plus de votes
        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                // Si un candidat a plus de votes que le max actuel
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        // Retourne le nom et le nombre de votes du gagnant
        return (candidates[winnerId].name, candidates[winnerId].voteCount);
    }
}
