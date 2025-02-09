import {
  constants,
  Provider,
  Contract,
  Account,
  json,
  shortString,
  RpcProvider,
  hash,
} from "starknet";
import fs from "fs";

async function main() {
  const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  // Check that communication with provider is OK
  const ci = await provider.getChainId();
  console.log("chain Id =", ci);

  // Initialize existing Argent X testnet accountn
  const accountAddress =
      "0x040387c9cf388EA45c751c51fDfE3670C657dBc5367EAc3A1165AA9097048708";
  const privateKey =
      "0x021f292dc834d83df5d6987b6904bd9c88ef0f8e4555aa557c378360a4bd574c";
  const account0 = new Account(provider, accountAddress, privateKey);
  console.log("existing_ACCOUNT_ADDRESS =", accountAddress);
  console.log("existing account connected.\n");

  // Since we already have the classhash, we will be skipping this part
  const testClassHash =
      "0x396823b2b056397dc8f3da80d20ae8f4b0630d33b089b36ba3c3c9a7a51c7d0";

  const deployResponse = await account0.deployContract({ classHash: testClassHash });
  await provider.waitForTransaction(deployResponse.transaction_hash);

  // Read ABI of Test contract
  const { abi: testAbi } = await provider.getClassByHash(testClassHash);
  if (testAbi === undefined) {
      throw new Error("no abi.");
  }

  // Connect the new contract instance:
  const myTestContract = new Contract(testAbi, deployResponse.contract_address, provider);
  console.log("✅ Test Contract connected at =", myTestContract.address);
}

// contract address: 0x75410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });