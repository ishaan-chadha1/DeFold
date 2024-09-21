import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedFasta, setParsedFasta] = useState(null);
  const [nounImg, setNounImg] = useState(''); // State to store the Noun image
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

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

  // Simple FASTA file parser with detailed header parsing
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

    const dataToSubmit = parsedFasta.map(seq => ({
      originalHeader: seq.header,
      parsedHeader: seq.parsedHeader,
      sequence: seq.sequence,
    }));

    console.log('Submitting the following data:', dataToSubmit);
    alert(`Data submitted successfully! File: ${selectedFile.name}`);

    await rewardUserWithNoun(); // Reward user after submission
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.fasta',
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="font-londrina text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10">
        Genomic Data Upload Dashboard
      </h1>

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
          <p className="font-londrina text-xl text-white">Drag & drop a FASTA file here, or click to select a file</p>
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
        <div className="mt-8 w-full max-w-lg bg-gray-900 p-5 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-4">Parsed FASTA Sequences:</h3>
          {parsedFasta.map((seq, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold">{seq.header}</p>
              <p className="whitespace-pre-line break-all text-sm">{seq.sequence}</p>
              <p className="text-sm text-gray-400">Accession: {seq.parsedHeader.accession}</p>
              <p className="text-sm text-gray-400">Nucleotide Range: {seq.parsedHeader.nucleotideRange}</p>
              <p className="text-sm text-gray-400">Organism: {seq.parsedHeader.organism}</p>
              <p className="text-sm text-gray-400">Chromosome: {seq.parsedHeader.chromosome}</p>
              <p className="text-sm text-gray-400">Genome Assembly: {seq.parsedHeader.genomeAssembly}</p>
              <p className="text-sm text-gray-400">Assembly Type: {seq.parsedHeader.assemblyType}</p>
            </div>
          ))}
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
              className="font-londrina mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
