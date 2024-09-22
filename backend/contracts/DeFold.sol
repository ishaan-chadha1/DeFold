// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 < 0.9.0;

contract DeFold {
    // Structure to hold researcher information and their ratings.
    struct Researcher {
        string name; // Researcher's name
        uint ratingSum; // Sum of all ratings received by this researcher
        uint ratingCount; // Number of ratings received
    }

    // Data structure to hold genomic data.
    struct GenomicData {
        string chromosome;
        string gene;
        string organism;
        string nucleotideRange;
        string assemblyType;
        string accession;
        string sequence; // Private genomic sequence data
        string title;
        uint price; // Price in wei
        address payable owner; // Researcher's address
    }

    // Mapping to store genomic data by ID.
    mapping(uint => GenomicData) public genomicDataRegistry;
    uint public genomicDataCounter;

    // Mapping to track if a buyer has purchased genomic data.
    mapping(uint => mapping(address => bool)) public hasPurchased;

    // Mapping to store researcher information by address.
    mapping(address => Researcher) public researchers;

    // Events
    event GenomicDataSubmitted(uint indexed dataId, string title, uint price, address indexed owner);
    event GenomicDataSold(uint indexed dataId, address indexed buyer, uint price);
    event ResearcherRated(address indexed researcher, address indexed rater, uint rating);

    // Submit genomic data and register researcher if not already registered
    function submitGenomicData(
        string memory _name,
        string memory _chromosome,
        string memory _gene,
        string memory _organism,
        string memory _nucleotideRange,
        string memory _assemblyType,
        string memory _accession,
        string memory _sequence,
        string memory _title,
        uint _price
    ) external {
        require(_price > 0, "Price must be greater than 0");

        // Register the researcher if they haven't been registered yet
        if (bytes(researchers[msg.sender].name).length == 0) {
            researchers[msg.sender].name = _name;
        }

        genomicDataCounter++;
        GenomicData storage newGenomicData = genomicDataRegistry[genomicDataCounter];
        newGenomicData.chromosome = _chromosome;
        newGenomicData.gene = _gene;
        newGenomicData.organism = _organism;
        newGenomicData.nucleotideRange = _nucleotideRange;
        newGenomicData.assemblyType = _assemblyType;
        newGenomicData.accession = _accession;
        newGenomicData.sequence = _sequence;
        newGenomicData.title = _title;
        newGenomicData.price = _price;
        newGenomicData.owner = payable(msg.sender);

        emit GenomicDataSubmitted(genomicDataCounter, _title, _price, msg.sender);
    }

    // Buyer can purchase genomic data and get nucleotide counts (only for them)
    function purchaseGenomicData(uint _dataId) external payable returns (uint aCount, uint cCount, uint tCount, uint gCount) {
        GenomicData storage genomicData = genomicDataRegistry[_dataId];
        require(msg.value >= genomicData.price, "Insufficient payment");

        // Mark the buyer as having purchased the data before transferring funds
        hasPurchased[_dataId][msg.sender] = true;

        // Transfer payment to the researcher (data owner)
        genomicData.owner.transfer(msg.value);

        // Calculate nucleotide counts
        string memory sequence = genomicData.sequence;
        for (uint i = 0; i < bytes(sequence).length; i++) {
            if (bytes(sequence)[i] == 'A') aCount++;
            else if (bytes(sequence)[i] == 'C') cCount++;
            else if (bytes(sequence)[i] == 'T') tCount++;
            else if (bytes(sequence)[i] == 'G') gCount++;
        }

        // Emit an event for the purchase
        emit GenomicDataSold(_dataId, msg.sender, msg.value);
    }

    // Buyer can get nucleotide counts (ACTG) after purchase
    function getNucleotideCounts(uint _dataId) external view returns (uint aCount, uint cCount, uint tCount, uint gCount) {

        GenomicData storage genomicData = genomicDataRegistry[_dataId];
        string memory sequence = genomicData.sequence;

        for (uint i = 0; i < bytes(sequence).length; i++) {
            if (bytes(sequence)[i] == 'A') aCount++;
            else if (bytes(sequence)[i] == 'C') cCount++;
            else if (bytes(sequence)[i] == 'T') tCount++;
            else if (bytes(sequence)[i] == 'G') gCount++;
        }
    }

    function calculateGCBasePair(uint _dataId) external view returns (uint gcCount) {

        GenomicData storage genomicData = genomicDataRegistry[_dataId];
        string memory sequence = genomicData.sequence;

        for (uint i = 0; i < bytes(sequence).length; i++) {
            if (bytes(sequence)[i] == 'G' || bytes(sequence)[i] == 'C') {
                gcCount++;
            }
        }
    }

    // Calculate homologous base pair count with another sequence
    function calculateHomologousBasePair(uint _dataId, string memory _compareSequence) external view returns (uint homologousCount) {
        
        GenomicData storage genomicData = genomicDataRegistry[_dataId];
        string memory sequence = genomicData.sequence;

        for (uint i = 0; i < bytes(sequence).length; i++) {
            if (bytes(sequence)[i] == bytes(_compareSequence)[i]) {
                homologousCount++;
            }
        }
    }

    // Rate the researcher (data owner)
    function rateResearcher(address _researcher, uint _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        Researcher storage researcher = researchers[_researcher];

        // Update the rating sum and count
        researcher.ratingSum += _rating;
        researcher.ratingCount++;

        emit ResearcherRated(_researcher, msg.sender, _rating);
    }

    // Get researcher rating (average rating between 1-5)
    function getResearcherRating(address _researcher) public view returns (uint averageRating) {
        Researcher storage researcher = researchers[_researcher];

        if (researcher.ratingCount > 0) {
            return researcher.ratingSum / researcher.ratingCount;
        }
        return 0; // Return 0 if the researcher has no ratings
    }

    // Get genomic data information (without revealing the sequence or specific data fields)
    function getGenomicDataInfo(uint _dataId) external view returns (
        string memory title,
        uint price,
        address owner,
        string memory organism,
        string memory nucleotideRange,
        string memory gene,
        uint ownerRating
    ) {
        GenomicData storage genomicData = genomicDataRegistry[_dataId];
        uint avgRating = getResearcherRating(genomicData.owner);

        return (
            genomicData.title,
            genomicData.price,
            genomicData.owner,
            genomicData.organism,
            genomicData.nucleotideRange,
            genomicData.gene,
            avgRating
        );
    }
}
