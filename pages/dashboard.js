import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import NounLoadingAnimation from '@/components/NounLoadingAnimation';
import { AnimatePresence, motion } from 'framer-motion';
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
export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedFasta, setParsedFasta] = useState(null);
  const [fileName, setFileName] = useState(''); // New state for the file name
  const [nounImg, setNounImg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForTx, setIsWaitingForTx] = useState(false); // New modal for waiting for MetaMask transaction
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    parseFasta(file); // Call the FASTA parser when file is uploaded
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = sapphire.wrap(new ethers.providers.Web3Provider(window.ethereum));
          const signer = provider.getSigner(); // Get the signer

          const contractInstance = new ethers.Contract(contractAddress, abi, provider);
          const contractWithSignerInstance = new ethers.Contract(contractAddress, abi, signer); // Contract with signer

          setContractWithSigner(contractWithSignerInstance); // Store the signer contract
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

  const parseFasta = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const sequences = parseFastaContent(content);
      console.log('Parsed FASTA sequences:', sequences);
      setParsedFasta(sequences);
    };
    reader.readAsText(file); // Reading file as plain text
  };

  const parseFastaContent = (content) => {
    const lines = content.split('\n');
    const sequences = [];
    let currentSequence = { header: '', sequence: '', parsedHeader: {} };

    lines.forEach((line) => {
      if (line.startsWith('>')) {
        if (currentSequence.header) {
          sequences.push(currentSequence);
        }
        const header = line.trim();
        currentSequence = {
          header: header,
          sequence: '',
          parsedHeader: parseHeader(header),
        };
      } else {
        currentSequence.sequence += line.trim();
      }
    });

    if (currentSequence.header) {
      sequences.push(currentSequence);
    }

    return sequences;
  };

  const parseHeader = (header) => {
    const cleanedHeader = header.slice(1).trim();
    const [accessionAndRange, ...rest] = cleanedHeader.split(' ');
    const [accession, range] = accessionAndRange.split(':');
    const organism = rest[0] + ' ' + rest[1];
    const chromosome = rest[2] + ' ' + rest[3];
    const assembly = rest[4];
    const assemblyType = rest[5] + ' ' + rest[6];

    return {
      accession: accession || 'N/A',
      nucleotideRange: range || 'N/A',
      organism: organism || 'N/A',
      chromosome: chromosome || 'N/A',
      genomeAssembly: assembly || 'N/A',
      assemblyType: assemblyType || 'N/A',
    };
  };

  const rewardUserWithNoun = async () => {
    try {
      const response = await axios.get('/api/noun');
      const nounSvgData = response.data;
      if (nounSvgData) {
        setNounImg(nounSvgData);
        setIsModalOpen(true); // Open modal after Noun is fetched
      } else {
        console.error("No image found in response");
      }
    } catch (error) {
      console.error("Error fetching noun:", error);
    }
  };

  const handleSubmitData = async () => {
    if (!selectedFile) {
      alert('Please upload a FASTA file before submitting.');
      return;
    }

    if (!fileName) {
      alert('Please enter a name for the file.');
      return;
    }

    const dataToSubmit = parsedFasta.map(seq => ({
      originalHeader: seq.header,
      parsedHeader: seq.parsedHeader,
      sequence: seq.sequence,
    }));

    try {
      setIsWaitingForTx(true); // Show "waiting for MetaMask" modal

      for (const seq of dataToSubmit) {
        const {
          originalHeader,
          parsedHeader,
          sequence,
        } = seq;

        const title = fileName; // Use the file name input by the user
        const price = ethers.utils.parseEther("0.1"); 

        const tx = await contractWithSigner.submitGenomicData(
          "ResearcherExample",
          parsedHeader.chromosome || "unknown",
          parsedHeader.gene || "unknown",
          parsedHeader.organism || "unknown",
          parsedHeader.nucleotideRange || "unknown",
          parsedHeader.assemblyType || "unknown",
          parsedHeader.accession || "unknown",
          sequence,
          title,
          price
        );

        await tx.wait(); // Wait for transaction to be mined
        setTransactionStatus('success'); // Set transaction as successful
        console.log(`Submitted genomic data: ${title}`);
      }

      await rewardUserWithNoun(); // Show reward modal if successful
    } catch (error) {
      setTransactionStatus('failure'); // Set transaction as failed
      console.error("Error submitting genomic data:", error);
      alert("There was an error submitting your data. Please try again.");
    } finally {
      setIsWaitingForTx(false); // Hide waiting for MetaMask modal
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.fasta',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds for the loading animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex items-center justify-center bg-black"
          >
            <NounLoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoading && (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
          <h1 className="font-londrina text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10">
            Genomic Data Upload Dashboard
          </h1>

          {/* Input for file name */}
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter a name for the file"
            className="mb-4 p-2 rounded-lg text-black"
          />

          <div
            {...getRootProps()}
            className={`bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg mb-8 w-full max-w-lg border-dashed border-4 ${
              isDragActive ? 'border-green-500' : 'border-white'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="font-londrina text-xl text-green-400">Drop the FASTA file here...</p>
            ) : (
              <p className="font-londrina text-xl text-black">Drag & drop a FASTA file here, or click to select a file</p>
            )}
            {selectedFile && (
              <p className="font-londrina mt-3 text-green-400">File selected: {selectedFile.name}</p>
            )}
          </div>

          <button
            onClick={handleSubmitData}
            className="font-londrina px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Submit Data
          </button>

          {parsedFasta && (
            <div className="mt-8 w-full max-w-lg bg-gray-900 p-5 rounded-lg text-black">
              <h3 className="font-londrina text-white text-2xl font-bold mb-4">Parsed FASTA Sequences:</h3>
              {parsedFasta.map((seq, index) => (
                <div key={index} className="mb-4">
                  <p className="font-londrina text-white font-bold">{seq.header}</p>
                  <p className="font-londrina whitespace-pre-line break-all text-white text-sm">{seq.sequence}</p>
                  <p className="font-londrina text-sm text-gray-400">Accession: {seq.parsedHeader.accession}</p>
                  <p className="font-londrina text-sm text-gray-400">Nucleotide Range: {seq.parsedHeader.nucleotideRange}</p>
                  <p className="font-londrina text-sm text-gray-400">Organism: {seq.parsedHeader.organism}</p>
                  <p className="font-londrina text-sm text-gray-400">Chromosome: {seq.parsedHeader.chromosome}</p>
                  <p className="font-londrina text-sm text-gray-400">Genome Assembly: {seq.parsedHeader.genomeAssembly}</p>
                  <p className="font-londrina text-sm text-gray-400">Assembly Type: {seq.parsedHeader.assemblyType}</p>
                </div>
              ))}
            </div>
          )}

          {/* Modal for waiting for MetaMask */}
          {isWaitingForTx && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="font-londrina text-black text-2xl font-bold mb-4">
                  {transactionStatus === null ? 'Waiting for MetaMask...' : transactionStatus === 'success' ? 'Data Uploaded Successfully!' : 'Transaction Failed'}
                </h3>
                {transactionStatus && (
                  <button
                    onClick={() => setIsWaitingForTx(false)}
                    className="font-londrina mt-4 bg-blue-500 text-black px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Modal for displaying the Noun */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="font-londrina text-black text-2xl font-bold mb-4">Congratulations! You have earned a Noun!</h3>
                <div dangerouslySetInnerHTML={{ __html: nounImg }}></div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="font-londrina mt-4 bg-blue-500 text-black px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}