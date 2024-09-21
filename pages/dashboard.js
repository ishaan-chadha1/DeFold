import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [parsedFasta, setParsedFasta] = useState(null);

  // Mock data for available algorithms
  const algorithms = [
    'DNA Sequencing Analysis',
    'Gene Expression Profiling',
    'Epigenetic Pattern Analysis',
    'Genome-Wide Association Study (GWAS)',
    'Variant Calling',
  ];

  // Handle file drop via drag-and-drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    parseFasta(file); // Call the FASTA parser when file is uploaded
  }, []);

  // Parse FASTA files
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

  // Simple FASTA file parser
  const parseFastaContent = (content) => {
    const lines = content.split('\n');
    const sequences = [];
    let currentSequence = { header: '', sequence: '' };

    lines.forEach((line) => {
      if (line.startsWith('>')) {
        // Start of a new sequence
        if (currentSequence.header) {
          sequences.push(currentSequence);
        }
        currentSequence = { header: line.trim(), sequence: '' };
      } else {
        // Append sequence data
        currentSequence.sequence += line.trim();
      }
    });

    // Push the last sequence
    if (currentSequence.header) {
      sequences.push(currentSequence);
    }

    return sequences;
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleRunAnalysis = () => {
    if (!selectedFile || !selectedAlgorithm) {
      alert('Please upload a FASTA file and choose an algorithm to proceed.');
      return;
    }
    // Process data (mock for now)
    alert(`Running ${selectedAlgorithm} on ${selectedFile.name}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.fasta',
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10">
        Genomic Data Analysis Dashboard
      </h1>

      {/* Drag and Drop File Upload Area */}
      <div
        {...getRootProps()}
        className={`bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg mb-8 w-full max-w-lg border-dashed border-4 ${
          isDragActive ? 'border-green-500' : 'border-white'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-xl text-green-400">Drop the FASTA file here...</p>
        ) : (
          <p className="text-xl text-white">Drag and drop a FASTA file here, or click to select a file</p>
        )}
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

      {/* Display Parsed FASTA Data */}
      {parsedFasta && (
        <div className="mt-8 w-full max-w-lg bg-gray-900 p-5 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-4">Parsed FASTA Sequences:</h3>
          {parsedFasta.map((seq, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold">{seq.header}</p>
              <p className="whitespace-pre-line break-all text-sm">{seq.sequence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
