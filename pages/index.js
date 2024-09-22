import Link from 'next/link';

export default function Home() {
  const companies = [
    {
      name: 'Oasis Blockchain',
      logo: '/oasis-logo.png',
    },
    {
      name: 'Worldcoin',
      logo: '/worldcoin-logo.png',
    },
    {
      name: 'Ethereum',
      logo: '/ethereum-logo1.png',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="text-center space-y-8">
        {/* Logo and Title */}
        <div className="flex items-center justify-center space-x-4">
          <img
            src="/download.png" // Path to your company logo
            alt="DeFlow Logo"
            className="w-32 h-32 object-contain bg-transparent" // Adjust size as needed
          />
          <h1 className="font-londrina text-6xl font-extrabold text-black">
            Welcome to DeFlow
          </h1>
        </div>

        <p className="font-londrina text-xl text-black max-w-xl mx-auto">
          Securely log in with Worldcoin and access the future of Genomic Data Marketplaces.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <button className="font-londrina px-8 py-4 mt-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
              Login with Worldcoin
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
                <p className="font-londrina text-xl font-semibold text-black">{company.name}</p>
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
                <p className="font-londrina text-xl font-semibold text-black">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
