"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { crowdFundABI } from "../../lib/abi";
import NavBar from "@/Components/NavBar/NavBar";
import CampaignCard from "@/Components/CampaignCard/CampaignCard";
import Footer from "@/Components/Footer/Footer";
import { Loader } from "@/Components/Loader/Loader";
import { AlertDialogDemo } from "@/Components/AlertDialog/AlertDialog";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

// Define the structure of a Campaign based on your smart contract
interface Campaign {
  owner: string;
  title: string;
  description: string;
  goal: bigint;
  fundsRaised: bigint;
  completed: boolean;
}

// Add global declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define target network configuration
const SEPOLIA_CHAIN_ID = "11155111";
const SEPOLIA_HEX_CHAIN_ID = "0xaa36a7";
const contractAddress = "0x776D999Dc83b22261b841ff6cD173BBC01957806" as
  | string
  | undefined;

const Page = () => {
  // State variables
  // --------- state for loading spinner ---------
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  //   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [campaigns, setCampaigns] = useState<({ id: number } & Campaign)[]>([]);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // 👈🏽 New state for network check

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");

  // --------- alert for success and error messages ---------
  const [alert, setAlert] = React.useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });
  //useEffect to handle account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };

      const handleChainChanged = () => {
        // Reload the page to reset the state and re-check the network
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Cleanup listeners on component unmount
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    const network = await provider.getNetwork();
    if (network.chainId.toString() === SEPOLIA_CHAIN_ID) {
      setIsCorrectNetwork(true);
      return true;
    } else {
      setIsCorrectNetwork(false);
      return false;
    }
  };

  const switchNetwork = async () => {
    console.log("Attempting to switch to Sepolia network...");

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_HEX_CHAIN_ID }],
        });
        console.log("Switched to Sepolia network");
      } catch (switchError: any) {
        console.error("Failed to switch network", switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_HEX_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  rpcUrls: ["https://rpc.sepolia.org/"],
                  nativeCurrency: {
                    name: "Sepolia ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Sepolia network", addError);
            setAlert({
              open: true,
              message: "Error",
              description:
                "Failed to add Sepolia network. Please add it manually to your MetaMask.",
              variant: "destructive",
            });
          }
        } else {
          console.error("Failed to switch network", switchError);
          setAlert({
            open: true,
            message: "Error",
            description:
              "Failed to switch to Sepolia network. Please switch manually in MetaMask.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Updated function to connect, check, and switch network
  const connectWallet = async () => {
    if (!window.ethereum) {
      setAlert({
        open: true,
        message: "Error",
        description: "MetaMask is not installed",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Check if on Sepolia
      const isOnCorrectNetwork = await checkNetwork(provider);
      if (!isOnCorrectNetwork) {
        await switchNetwork();
        // After attempting to switch, re-check. The page might reload due to the event listener,
        // but this provides a fallback.
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await checkNetwork(newProvider);
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      if (!contractAddress) {
        throw new Error(
          "Contract address is not defined. Please set CONTRACT_ADDRESS in your environment variables."
        );
      }
      const contractInstance = new ethers.Contract(
        contractAddress,
        crowdFundABI,
        signer
      );

      //   setProvider(provider);
      setAccount(accounts[0]);
      setContract(contractInstance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    if (contract) {
      try {
        setLoading(true);
        const campaignCount = await contract.campaignCount();
        const campaignsData = [];
        for (let i = 1; i <= campaignCount; i++) {
          const campaign = await contract.campaigns(i);
          campaignsData.push({
            id: i,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            goal: campaign.goal,
            fundsRaised: campaign.fundsRaised,
            completed: campaign.completed,
          });
        }
        setCampaigns(campaignsData.reverse());
      } catch (error) {
        console.error("Could not fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (contract && isCorrectNetwork) {
      fetchCampaigns();
    }
  }, [contract, isCorrectNetwork]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isCorrectNetwork) {
      setAlert({
        open: true,
        message: "Error",
        description: "Please connect to the Sepolia network first.",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const goalInWei = ethers.parseEther(goal);
      const tx = await contract.createCampaign(title, description, goalInWei);
      await tx.wait();
      setAlert({
        open: true,
        message: "Success",
        description: "Campaign created successfully!",
        variant: "default",
      });
      // reset form
      setTitle("");
      setDescription("");
      setGoal("");
      // refresh campaigns
      fetchCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
      setAlert({
        open: true,
        message: "Error",
        description: "Failed to create campaign.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (handleFundCampaign and handleWithdrawFunds remain the same)
  const handleFundCampaign = async (id: number, amount: string) => {
    if (!contract || !isCorrectNetwork || !amount) {
      setAlert({
        open: true,
        message: "Error",
        description:
          "Please connect to the Sepolia network and enter an amount.",
        variant: "destructive",
      });
      return;
    }
    try {
      const amountInWei = ethers.parseEther(amount);
      const tx = await contract.fundCampaign(id, { value: amountInWei });
      await tx.wait();
      setAlert({
        open: true,
        message: "Success",
        description: "Thank you for your donation!",
        variant: "default",
      });
      fetchCampaigns();
    } catch (error) {
      console.error("Error funding campaign:", error);
      setAlert({
        open: true,
        message: "Error",
        description: "Failed to fund campaign.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawFunds = async (id: number) => {
    if (!contract || !isCorrectNetwork) {
      setAlert({
        open: true,
        message: "Error",
        description: "Please connect to the Sepolia network first.",
        variant: "destructive",
      });
      return;
    }
    try {
      const tx = await contract.withdrawFunds(id);
      await tx.wait();
      setAlert({
        open: true,
        message: "Success",
        description: "Funds withdrawn successfully!",
        variant: "default",
      });
      fetchCampaigns();
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setAlert({
        open: true,
        message: "Error",
        description: "Failed to withdraw funds.",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      {loading && (
        <div className="dark:bg-gray-dark/50 fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <Loader />
        </div>
      )}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar
          onConnectWallet={connectWallet}
          account={account}
          isCorrectNetwork={isCorrectNetwork}
          isNewCampaignPage={true}
        />
      </div>

      <div className="relative bg-[#0A0517] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* The Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3">
          <div className="w-[600px] h-[600px] bg-purple-900 rounded-full blur-3xl opacity-25"></div>
        </div>
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {account && isCorrectNetwork && (
            <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Create a New Campaign
              </h2>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <input
                  type="text"
                  placeholder="Campaign Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <textarea
                  placeholder="Campaign Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={3}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Goal (in ETH)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-3xl shadow-lg shadow-indigo-500/30"
                >
                  Create Campaign
                </button>
              </form>
            </section>
          )}
        </div>
      </div>

      <section>
        {/* <h2 className="text-3xl font-semibold mb-6 text-center">
          Active Campaigns
        </h2> */}
        {isCorrectNetwork ? (
          <div className="p-10 bg-[#0A0517] ">
            <h1 className="text-3xl font-bold text-white text-center mt-10">
              Your Campaigns
            </h1>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {campaigns.map((campaign, index) => (
                <div key={index}>
                  {account?.toLowerCase() === campaign.owner.toLowerCase() && (
                    <CampaignCard
                      key={index}
                      campaign={campaign}
                      onFund={handleFundCampaign}
                      onWithdraw={handleWithdrawFunds}
                      currentUser={account}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-5 text-2xl">
            Connect to the Sepolia network to view campaigns.
          </p>
        )}
      </section>
      {/* footer */}
      <div className="mt-5 mb-2">
        <Footer />
      </div>
      <AlertDialogDemo
        isOpen={alert.open}
        title={alert.message}
        description={alert.description}
        variant={alert.variant}
        handleCancel={() => {
          setAlert({ ...alert, open: false });
        }}
      />
    </div>
  );
};

export default Page;
