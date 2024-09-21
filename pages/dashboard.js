import { useState } from 'react';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  // Mock data for available algorithms
  const algorithms = [
    'DNA Sequencing Analysis',
    'Gene Expression Profiling',
    'Epigenetic Pattern Analysis',
    'Genome-Wide Association Study (GWAS)',
    'Variant Calling',
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleRunAnalysis = () => {
    if (!selectedFile || !selectedAlgorithm) {
      alert('Please upload a file and choose an algorithm to proceed.');
      return;
    }
    // Process data (mock for now)
    alert(`Running ${selectedAlgorithm} on ${selectedFile.name}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10">
        Genomic Data Analysis Dashboard
      </h1>

      {/* File Upload Area */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg mb-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Your Data</h2>
        <input
          type="file"
          accept=".csv, .fasta"
          onChange={handleFileUpload}
          className="w-full p-3 bg-gray-800 text-white rounded-lg"
        />
        {selectedFile && (
          <p className="mt-3 text-green-400">File selected: {selectedFile.name}</p>
        )}
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg mb-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Choose Algorithm</h2>
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

      {/* Run Analysis Button */}
      <button
        onClick={handleRunAnalysis}
        className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
      >
        Run Analysis
      </button>
    </div>
  );
}
