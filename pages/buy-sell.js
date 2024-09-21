import Link from "next/link";

export default function BuySell() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        What would you like to do?
      </h1>
      <div className="flex justify-center space-x-4 pt-10">
      <Link href="/marketplace">
          <button className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
            Buy Data
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
            Sell Data
          </button>
        </Link>
        </div>
    </div>
  );
}
