import Link from 'next/link';

export default function Home() {
  const companies = [
    {
      name: 'Oasis Blockchain',
      logo: '/oasis-logo.png',
    },
    {
      name: 'Worldcoin',
      logo: '/worldcoin-logo.png', // Inverted color if necessary
    },
    {
      name: 'IPFS',
      logo: '/ipfs-logo1.png',
    },
    {
      name: 'Ethereum',
      logo: '/ethereum-logo1.png',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-extrabold text-black">
          Welcome to DeFlow
        </h1>
        <p className="text-xl text-black max-w-xl mx-auto">
          Securely log in with Worldcoin and access the future of Genomic Data Marketplaces.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <button className="px-8 py-4 mt-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
              Login with Worldcoin
            </button>
          </Link>
          <Link href="/marketplace">
            <button className="px-8 py-4 mt-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
              Go to Marketplace
            </button>
          </Link>
        </div>
  
        {/* Continuous Scrolling Carousel */}
        <div className="marquee mt-12 w-full overflow-hidden">
          <div className="marquee-content">
            {companies.map((company, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 object-contain mb-4"
                />
                <p className="text-xl font-semibold text-black">{company.name}</p>
              </div>
            ))}
            {/* Repeat logos to ensure the scrolling is seamless */}
            {companies.map((company, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 object-contain mb-4"
                />
                <p className="text-xl font-semibold text-black">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}
