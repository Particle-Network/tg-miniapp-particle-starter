import { formatBalance, shortString } from "@/utils";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// Particle imports
import { useEthereum } from "@particle-network/auth-core-modal";
import { AAWrapProvider, SendTransactionMode } from "@particle-network/aa";
import { ethers, type Eip1193Provider } from "ethers";

// Configuration Constants
// Those are to manage chain selection from the dropdown in the UI
const supportedChains = [
  { name: "EthereumSepolia", id: 11155111, fullname: "Ethereum Sepolia" },
  { name: "BaseSepolia", id: 84532, fullname: "Base Sepolia" },
];

// SmartAccount Prop Type
interface EVMDemoProps {
  smartAccount: any;
}

/**
 * EVMDemo Component
 *
 * This component demonstrates the use of a smart account to interact with Ethereum blockchains.
 * It allows users to switch chains, view their Ether balance, check smart account deployment status,
 * and send native cryptocurrency transactions.
 */
const EVMDemo = ({ smartAccount }: EVMDemoProps) => {
  // UI State Management
  const [recipientAddress, setRecipientAddress] = useState("");
  const [balance, setBalance] = useState<string>("");
  const [isWalletDeployed, setIsWalletDeployed] = useState<boolean>(false);

  // Functions from Auth Core
  const { switchChain, provider, chainInfo } = useEthereum();

  // Provider Setup with gasless transactions
  const ethersProvider = new ethers.BrowserProvider(
    new AAWrapProvider(
      smartAccount,
      SendTransactionMode.Gasless
    ) as Eip1193Provider,
    "any"
  );

  /**
   * Fetches and sets the user's Ether balance.
   *
   * @async
   * @returns {Promise<void>}
   * @throws Will log an error to the console if fetching the balance fails.
   */
  const fetchBalance = useCallback(async () => {
    try {
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const balanceResponse = await ethersProvider.getBalance(address);
      const balanceInEther = ethers.formatEther(balanceResponse);

      setBalance(formatBalance(balanceInEther));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [ethersProvider]);

  /**
   * Checks the deployment status of the smart account and updates the state.
   * Smart accounts are deployed with the first transaction on the specific chain
   *
   * @async
   * @returns {Promise<void>}
   * @throws Will log an error to the console if fetching the deployment status fails.
   */
  const fetchDeploymentStatus = useCallback(async () => {
    if (!smartAccount) return;

    try {
      const deployedStatus = await smartAccount.isDeployed();
      console.log("Smart Wallet Deployment Status:", deployedStatus);
      setIsWalletDeployed(deployedStatus);
    } catch (error) {
      console.error("Failed to fetch smart wallet deployment status:", error);
    }
  }, [smartAccount, chainInfo]);

  // Effect Hooks

  // Fetch Balance Effect
  useEffect(() => {
    fetchBalance();
  }, [chainInfo, fetchBalance]);

  // Fetch Deployment Status Effect
  useEffect(() => {
    fetchDeploymentStatus();
  }, [fetchDeploymentStatus]);

  /**
   * Sends a native token transfer using the smart account.
   *
   * @async
   * @returns {Promise<void>}
   * @throws Will show a toast notification and log an error to the console if the transaction fails.
   */
  const sendNativeTransaction = async () => {
    if (!recipientAddress) {
      toast.error("Please enter a recipient address.");
      return;
    }

    try {
      const signer = await ethersProvider.getSigner();
      const txResponse = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther("0.01"),
        data: "0x",
      });

      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        toast.success(`Transaction sent! Hash: ${shortString(txReceipt.hash)}`);
      }
    } catch (error) {
      console.error("Error executing EVM transaction:", error);
      toast.error("Transaction failed.");
    }
  };

  /**
   * Switches the chain based on user selection.
   *
   * @param {string} key - The key representing the selected chain.
   */
  const handleChainSwitch = (key: string) => {
    if (key) {
      const chainId = Number(key.split("-")[1]);
      switchChain(chainId); // switchChain is a built-in function from the useEthereum hook
    }
  };

  // Render UI
  return (
    <div className="flex w-full flex-col items-center gap-4 py-10">
      <h2 className="text-white">
        Smart Wallet Deployed: {isWalletDeployed.toString()}
      </h2>
      <Select
        label="Current Chain"
        placeholder="Select a chain"
        className="w-4/5"
        selectedKeys={[`${chainInfo.fullname}-${chainInfo.id}`]}
        onSelectionChange={(data) =>
          handleChainSwitch(data.currentKey as string)
        }
      >
        {supportedChains.map((chain) => (
          <SelectItem
            key={`${chain.fullname}-${chain.id}`}
            value={`${chain.fullname}-${chain.id}`}
          >
            {chain.fullname}
          </SelectItem>
        ))}
      </Select>
      <div className="w-4/5">
        <h3 className="mr-2 text-lg font-semibold text-purple-400">
          Balance: {balance} {chainInfo.nativeCurrency.symbol}
        </h3>
        <h3 className="mr-2 text-medium font-semibold">Input an address</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="mt-4 w-full rounded border border-gray-300 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        onClick={sendNativeTransaction}
        className="flex items-center justify-center h-12 w-64 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform active:scale-95 text-white font-medium border border-gray-300 hover:bg-gray-700 hover:border-transparent"
      >
        {`Send native 0.01 ${chainInfo.nativeCurrency.symbol}`}
      </button>
    </div>
  );
};

export default EVMDemo;
