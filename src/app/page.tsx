"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { crowdFundABI } from "../lib/abi";

import Explore from "@/Components/Explore/Explore";
import Footer from "@/Components/Footer/Footer";
import Hero from "@/Components/Hero/Hero";
import HowItWorks from "@/Components/HowItWorks/HowItWorks";
import NavBar from "@/Components/NavBar/NavBar";
import React from "react";
import { AlertDialogDemo } from "@/Components/AlertDialog/AlertDialog";
import { Loader } from "@/Components/Loader/Loader";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [campaigns, setCampaigns] = useState<({ id: number } & Campaign)[]>([]);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // 👈🏽 New state for network check

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (switchError: any) {
        console.error("Failed to switch network", switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            setLoading(true);
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
          } finally {
            setLoading(false);
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

  // 👈🏽 Updated function to connect, check, and switch network
  const connectWallet = async () => {
    if (!window.ethereum) {
      setAlert({
        open: true,
        message: "Error",
        description: "Please install MetaMask!",
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

      // setProvider(provider);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        />
      </div>
      <Hero />
      {/* explore */}
      <div className="mt-10 mb-10">
        <Explore
          campaigns={campaigns}
          isCorrectNetwork={isCorrectNetwork}
          onFund={handleFundCampaign}
          onWithdraw={handleWithdrawFunds}
          currentUser={account}
        />
      </div>
      {/* how it works */}
      <div className="mt-10 mb-5">
        <HowItWorks />
      </div>
      {/* footer */}
      <div className=" mb-2">
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
