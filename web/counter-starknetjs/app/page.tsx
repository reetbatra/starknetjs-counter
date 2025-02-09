"use client";
import dynamic from "next/dynamic";
import { useBlockNumber } from "@starknet-react/core";

// ✅ Ensure WalletBar is imported dynamically for client-side rendering
const WalletBar = dynamic(() => import("./components/WalletBar"), { ssr: false });

export default function Home() {
  // ✅ Step 1 --> Read the latest block
  const {
    data: blockNumberData,
    isLoading: blockNumberIsLoading,
    isError: blockNumberIsError,
  } = useBlockNumber({
    blockIdentifier: "latest",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
        🚀 Starknetjs Counter Demo
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-full max-w-md space-y-6">
          {/* ✅ Wallet Connection Section */}
          <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
            <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">
              🔗 Wallet Connection
            </h2>
            <WalletBar />
          </div>

          {/* ✅ Step 1 --> Display Block Number */}
          <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
            <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">
              ⛓️ Latest Block
            </h2>
            {blockNumberIsLoading && <p className="text-gray-400">Loading latest block...</p>}
            {blockNumberIsError && <p className="text-red-500">⚠️ Error fetching block number</p>}
            {blockNumberData && (
              <p className="text-lg font-medium text-[#1B98E0]">🔵 {blockNumberData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}