import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const contractAddress = "0x4b6FEa99456118cAffA8eDCD3AAC4E961551B51e"; // Your contract address
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
  "event ResearcherRated(address indexed researcher, address indexed rater, uint rating)",
  "function genomicDataCounter() view returns (uint)",
  "function genomicDataRegistry(uint) view returns (tuple(string chromosome, string gene, string organism, string nucleotideRange, string assemblyType, string accession, string sequence, string title, uint price, address owner))",
  "function calculateGCBasePair(uint _dataId) external view returns (uint gcCount)",
  "function calculateHomologousBasePair(uint _dataId, string _compareSequence) external view returns (uint homologousCount)",

];

export default function Marketplace() {
    // Available algorithms
    const algorithms = [
      'GNC Base Pair Calculation',
      'All Base Pair Calculation',
      'Homologous Base Pair Calculation',
    ];

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [contractWithSigner, setContractWithSigner] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = sapphire.wrap(new ethers.providers.Web3Provider(window.ethereum));
          const signer = provider.getSigner(); // Get the signer
  
          const contractWithSignerInstance = new ethers.Contract(contractAddress, abi, signer); // Contract with signer
          setContractWithSigner(contractWithSignerInstance); // Store the signer contract
          
          console.log("Successfully connected!");
          fetchGenomicData(contractWithSignerInstance); // Pass the contract instance here
        } else {
          console.log("Please install MetaMask!");
        }
      } catch (err) {
        console.log("Error fetching count: " + err.message);
      }
    };
    init();
  }, []);


  const fetchGenomicData = async (contract) => {
    try {
      const totalDataCount = await contract.genomicDataCounter();
      const dataPromises = [];
  
      for (let i = 1; i <= totalDataCount.toNumber(); i++) {
        dataPromises.push(contract.getGenomicDataInfo(i));
      }
  
      const genomicDataList = await Promise.all(dataPromises);
      const formattedProducts = genomicDataList.map((data, index) => ({
        id: index, // You might want to keep track of the index
        name: data.title,
        price: ethers.utils.formatEther(data.price), // Convert to ETH
        // other fields
      }));
  
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching genomic data:", error);
    }
  };
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleApplyAlgorithm = async () => {
    if (selectedAlgorithm) {
      alert(`Applying ${selectedAlgorithm} to ${selectedProduct.name}`);
  
      try {
        const priceInWei = ethers.utils.parseEther(selectedProduct.price); // Convert ETH price to Wei
  
        const tx = await contractWithSigner.purchaseGenomicData(selectedProduct.id, {
          value: priceInWei, 
        });
  
        await tx.wait(); 
        alert(`Purchased genomic data! for ${selectedProduct.name}`);

        if(selectedAlgorithm.startsWith('GC')){
          const gcCount = await contractWithSigner.calculateGCBasePair(selectedProduct.id);
          alert(`GC Base Pair Count: ${gcCount.toNumber()}`);
        }else if(selectedAlgorithm.startsWith('All')){
          const counts = await contractWithSigner.getNucleotideCounts(selectedProduct.id);
          const aCount = counts[0].toNumber(); 
          const cCount = counts[1].toNumber();
          const tCount = counts[2].toNumber();
          const gCount = counts[3].toNumber();
          alert(`Nucleotide Counts - A: ${aCount}, C: ${cCount}, T: ${tCount}, G: ${gCount}`);
          setTransactionStatus('success');
        }else if(selectedAlgorithm.startsWith('Homol')){
          const compareSequence = prompt("Enter the sequence to compare against:");
          if (!compareSequence) {
              alert("Please provide a sequence.");
              return;
          }
      
          try {
              const homologousCount = await contractWithSigner.calculateHomologousBasePair(selectedProduct.id, compareSequence);
              alert(`Homologous Base Pair Count: ${homologousCount.toNumber()}`);
              setTransactionStatus('success');
          } catch (error) {
              console.error("Error calculating homologous base pair count:", error);
              alert("You must purchase this data to view homologous counts.");
              setTransactionStatus('error');
          }
        }

      } catch (error) {
        console.error("Error purchasing genomic data:", error);
        alert("There was an error purchasing the data. Please try again.");
      }
  
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
