import { useState, useEffect } from 'react';

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  // Customized genomic data mock products
  const genomicProducts = [
    {
      id: 1,
      name: "Whole Genome Sequencing",
      price: "1.2 ETH",
      image: "/genome_sequencing.png",
      description: "Get your entire genome sequenced with high accuracy. Includes raw data and analysis report.",
    },
    {
      id: 2,
      name: "Ancestry Analysis",
      price: "0.5 ETH",
      image: "/ancestry_analysis.png",
      description: "Discover your ancestry and lineage based on your genomic data. Comprehensive reports included.",
    },
    {
      id: 3,
      name: "Genomic Dataset Access",
      price: "2.0 ETH",
      image: "/genomic_dataset.png",
      description: "Access curated genomic datasets for research purposes. Includes human, animal, and plant data.",
    },
    {
      id: 4,
      name: "Personalized Medicine Report",
      price: "0.8 ETH",
      image: "/personalized_medicine.png",
      description: "Receive a personalized medicine report based on your genomic profile, tailored to your health.",
    },
    {
      id: 5,
      name: "DNA Methylation Analysis",
      price: "1.0 ETH",
      image: "/methylation_analysis.png",
      description: "Analyze the DNA methylation patterns to understand gene expression and epigenetics.",
    },
  ];

  useEffect(() => {
    setProducts(genomicProducts);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10 mt-20">
        Genomic Data Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-lg text-gray-300 mb-2">{product.price}</p>
            <p className="text-sm text-gray-400 mb-4">{product.description}</p>
            <button
              onClick={() => alert(`Purchasing ${product.name}...`)}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mt-4"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
