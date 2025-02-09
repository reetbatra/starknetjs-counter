"use client";
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";

const WalletBar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] rounded-2xl shadow-lg w-full max-w-sm">
      {!address ? (
        <div className="flex flex-wrap justify-center gap-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="px-5 py-2 font-medium rounded-lg bg-[#0F3460] text-white border border-[#1B98E0] hover:bg-[#1B98E0] transition-all duration-300 shadow-md"
            >
              Connect {connector.id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <div className="text-sm bg-[#1B98E0] px-4 py-2 text-white font-semibold rounded-lg shadow-md">
            🔗 Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className="px-5 py-2 font-medium rounded-lg bg-red-600 text-white border border-red-800 hover:bg-red-800 transition-all duration-300 shadow-md"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletBar;