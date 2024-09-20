import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse">
          Welcome to the Worldcoin Auth App
        </h1>
        <p className="text-xl text-gray-300 max-w-xl mx-auto">
          Securely log in with Worldcoin and access the future of decentralized identity.
        </p>
        <div className="flex justify-center space-x-4"> {/* Added space between buttons */}
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
      </div>
    </div>
  );
}
