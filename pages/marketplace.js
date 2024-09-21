import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const contractAddress = "0xB39387394ac017a51FA487D22fA5258f1E71d546"; // Your contract address
const abi = [
  // Genomic Data submission
  "function submitGenomicData(string _name, string _chromosome, string _gene, string _organism, string _nucleotideRange, string _assemblyType, string _accession, string _sequence, string _title, uint _price) external",
  // Purchase genomic data and return nucleotide counts
  "function purchaseGenomicData(uint _dataId) external payable returns (uint aCount, uint cCount, uint tCount, uint gCount)",
  // Get nucleotide counts after purchase
  "function getNucleotideCounts(uint _dataId) external view returns (uint aCount, uint cCount, uint tCount, uint gCount)",
  // Rate a researcher
  "function rateResearcher(address _researcher, uint _rating) external",
  // Get researcher rating (average rating)
  "function getResearcherRating(address _researcher) public view returns (uint averageRating)",
  // Get genomic data information
  "function getGenomicDataInfo(uint _dataId) external view returns (string title, uint price, address owner, string ownerName, uint ownerRating)",
  // Events
  "event GenomicDataSubmitted(uint indexed dataId, string title, uint price, address indexed owner)",
  "event GenomicDataSold(uint indexed dataId, address indexed buyer, uint price)",
  "event ResearcherRated(address indexed researcher, address indexed rater, uint rating)"
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [contract, setContract] = useState()

  // Available algorithms
  const algorithms = [
    'DNA Sequencing Analysis',
    'Gene Expression Profiling',
    'Epigenetic Pattern Analysis',
    'Genome-Wide Association Study (GWAS)',
    'Variant Calling',
  ];

  // Updated genomic data mock products (realistic FASTA-like datasets)
  const genomicProducts = [
    {
      id: 1,
      name: "Human Chromosome 11: GRCh38",
      price: "1.5 ETH",
      image: "/chromosome_11.png",
      description: "Contains the full sequence for Human Chromosome 11 from the GRCh38 reference genome. Ideal for genomic research and variant analysis.",
    },
    {
      id: 2,
      name: "Mitochondrial Genome: Homo sapiens",
      price: "0.9 ETH",
      image: "/mitochondrial_genome.png",
      description: "Complete mitochondrial DNA sequence for Homo sapiens. Use for studies in mitochondrial disorders and evolutionary biology.",
    },
    {
      id: 3,
      name: "Bacterial Genome: E. coli K-12 MG1655",
      price: "2.2 ETH",
      image: "/bacterial_genome.png",
      description: "Full genomic sequence of E. coli strain K-12 MG1655. Widely used for research in microbiology and bacterial genomics.",
    },
    {
      id: 4,
      name: "Arabidopsis thaliana Genome",
      price: "1.8 ETH",
      image: "/plant_genome.png",
      description: "Genome sequence of the model organism Arabidopsis thaliana. Perfect for plant biology and genetic studies.",
    },
    {
      id: 5,
      name: "HLA Region: Human Chromosome 6",
      price: "1.1 ETH",
      image: "/hla_region.png",
      description: "Detailed sequence of the HLA region on Human Chromosome 6. Essential for immunogenetics and disease association studies.",
    },
  ];

  useEffect(() => {
    setProducts(genomicProducts);
  }, []);

  useEffect(() => {
    const init = async () => {
        try {
          if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
            const provider = sapphire.wrap(new ethers.providers.Web3Provider(window.ethereum));
            const contract2 = new ethers.Contract(contractAddress, abi, provider);
            setContract(contract2);
            const currentCount = await contract.getCount();
            setCount(currentCount.toString());
            console.log("Successfully connected!");
          } else {
            console.log("Please install MetaMask!");
          }
        } catch (err) {
          console.log("Error fetching count: " + err.message);
        }
      };
    init();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleApplyAlgorithm = () => {
    if (selectedAlgorithm) {
      alert(`Applying ${selectedAlgorithm} to ${selectedProduct.name}`);
      setShowModal(false);
    } else {
      alert("Please select an algorithm.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="font-londrina text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10 mt-20">
        Genomic Data Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h2 className="font-londrina text-2xl font-bold">{product.name}</h2>
            <p className="font-londrina text-lg text-gray-300 mb-2">{product.price}</p>
            <p className="font-londrina text-sm text-gray-400 mb-4">{product.description}</p>
            <button
              onClick={() => handleProductClick(product)}
              className="font-londrina px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mt-4"
            >
              Select Data Set
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Algorithm Selection */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="font-londrina text-3xl font-bold mb-4">{selectedProduct.name}</h2>
            <p className="font-londrina text-lg text-gray-300 mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <label className="font-londrina block text-gray-400 text-sm mb-2">Choose an Algorithm:</label>
              <select
                value={selectedAlgorithm}
                onChange={handleAlgorithmChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg"
              >
                <option value="">Select an Algorithm</option>
                {algorithms.map((algorithm, index) => (
                  <option key={index} value={algorithm}>
                    {algorithm}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleApplyAlgorithm}
              className="font-londrina px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mt-4"
            >
              Apply Algorithm
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="font-londrina px-6 py-3 bg-red-500 rounded-lg mt-4 ml-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
