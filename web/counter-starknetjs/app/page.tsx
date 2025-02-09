"use client";
import dynamic from "next/dynamic";
import { useBlockNumber, useAccount, useBalance, useReadContract, useTransactionReceipt, useSendTransaction, useContract } from "@starknet-react/core";
import ABI from "../public/abi.json";
import { type Abi } from "starknet";
import { useMemo, useState } from "react";

// ✅ Ensure WalletBar is imported dynamically for client-side rendering
const WalletBar = dynamic(() => import("./components/WalletBar"), { ssr: false });

export default function Home() {
  // ✅ Step 1 --> Read the latest block
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({ blockIdentifier: "latest" });

  // ✅ Step 2 --> Read your balance
  const { address: userAddress } = useAccount();
  const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({ address: userAddress, watch: true });

  // ✅ Step 3 --> Read from a contract
  const contractAddress = "0x75410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8";
  const { data: readData, isError: readIsError, isLoading: readIsLoading, error: readError } = useReadContract({
    functionName: "get_counter",
    args: [],
    abi: ABI as Abi,
    address: contractAddress,
    watch: true,
    refetchInterval: 1000,
  });

  // ✅ Step 4 & 5 --> Increase & Decrease Counter
  const [amount, setAmount] = useState<number | ''>(0);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  const typedABI = ABI as Abi;
  const { contract } = useContract({ abi: typedABI, address: contractAddress });

  // ✅ Calls for Increase Counter
  const increaseCalls = useMemo(() => (!userAddress || !contract || !amount ? [] : [contract.populate("increase_counter", [amount])]), [contract, userAddress, amount]);

  // ✅ Calls for Decrease Counter
  const decreaseCalls = useMemo(() => (!userAddress || !contract || !amount ? [] : [contract.populate("decrease_counter", [amount])]), [contract, userAddress, amount]);

  // ✅ Transaction Hook for Increase Counter
  const { send: increaseCounter, isPending: increaseIsPending } = useSendTransaction({ calls: increaseCalls });

  // ✅ Transaction Hook for Decrease Counter
  const { send: decreaseCounter, isPending: decreaseIsPending } = useSendTransaction({ calls: decreaseCalls });

  // ✅ Handle Submit Functions
  const handleIncreaseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    increaseCounter();
  };

  const handleDecreaseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    decreaseCounter();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">🚀 Starknetjs for noobs</h1>

      {/* ✅ Grid layout with 3 columns in each row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* ✅ Wallet Connection */}
        <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">🔗 Wallet Connection</h2>
          <WalletBar />
        </div>

        {/* ✅ Step 1: Display Block Number */}
        <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">⛓️ Latest Block</h2>
          {blockNumberIsLoading ? <p className="text-gray-400">Loading...</p> : blockNumberIsError ? <p>Error</p> : <p>🔵 {blockNumberData}</p>}
        </div>

        {/* ✅ Step 2: Display Wallet Balance */}
        <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">💰 Wallet Balance</h2>
          {!userAddress ? <p>Connect wallet</p> : balanceIsLoading ? <p>Loading...</p> : <p>💎 {balanceData?.formatted} {balanceData?.symbol}</p>}
        </div>

        {/* ✅ Step 3: Counter Value */}
        <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">🔢 Current Counter</h2>
          {readIsLoading ? <p>⏳ Loading...</p> : readIsError ? <p>Error</p> : <p>🔢 {readData}</p>}
        </div>

        {/* ✅ Step 4: Increase Counter */}
        <div className="bg-[#16213E] p-5 border border-[#1B98E0] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#1B98E0]">🔺 Increase Counter</h2>
          <p className="text-sm text-gray-300 mb-3">⚡ Make sure your wallet is connected before submitting a transaction!</p>
          <form onSubmit={handleIncreaseSubmit} className="flex flex-col space-y-4">
            <input type="number" value={amount} onChange={handleAmountChange} className="w-full p-2 text-black border border-gray-300 rounded-md" placeholder="Enter value" />
            <button type="submit" className="w-full bg-[#1B98E0] hover:bg-[#0F3460] text-white font-bold py-2 px-4 rounded-md transition duration-300">
              {increaseIsPending ? "Processing..." : "➕ Increase Counter"}
            </button>
          </form>
        </div>

        {/* ✅ Step 5: Decrease Counter */}
        <div className="bg-[#16213E] p-5 border border-[#E01B1B] shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-3 text-[#E01B1B]">🔻 Decrease Counter</h2>
          <p className="text-sm text-gray-300 mb-3">⚠️ Ensure your wallet is connected before decreasing the counter!</p>
          <form onSubmit={handleDecreaseSubmit} className="flex flex-col space-y-4">
            <input type="number" value={amount} onChange={handleAmountChange} className="w-full p-2 text-black border border-gray-300 rounded-md" placeholder="Enter value" />
            <button type="submit" className="w-full bg-[#E01B1B] hover:bg-[#A30D0D] text-white font-bold py-2 px-4 rounded-md transition duration-300">
              {decreaseIsPending ? "Processing..." : "➖ Decrease Counter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}