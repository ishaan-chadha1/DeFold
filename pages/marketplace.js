import { useState, useEffect } from 'react';

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: "Crypto Hoodie",
      price: "0.05 ETH",
      image: "/hoodie.png",
      description: "A hoodie that keeps you warm while repping the crypto revolution.",
    },
    {
      id: 2,
      name: "Web3 T-shirt",
      price: "0.03 ETH",
      image: "/tshirt.png",
      description: "A stylish T-shirt for the Web3 enthusiast.",
    },
    {
      id: 3,
      name: "Blockchain Cap",
      price: "0.02 ETH",
      image: "/cap.png",
      description: "Look cool while staying decentralised with this blockchain cap.",
    }
  ];

  // Load products
  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text mb-10">
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
