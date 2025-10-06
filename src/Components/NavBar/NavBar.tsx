"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  onConnectWallet: () => void;
  account?: string | null;
  isCorrectNetwork?: boolean;
  isNewCampaignPage?: boolean;
};

const NavBar = ({
  onConnectWallet,
  account,
  isCorrectNetwork,
  isNewCampaignPage,
}: Props) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center px-2 bg-black shadow-lg shadow-indigo-500/30">
      {/* logo */}
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/logo/logo.png"
          alt="logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <p className="text-white font-semibold text-2xl sm:block hidden">
          Funder
        </p>
      </div>
      {/* menu items */}
      {!isNewCampaignPage && (
        <div className="flex gap-5 items-center">
          <p className="text-white text-sm sm:block hidden">Explore</p>
          <p className="text-white text-sm sm:block hidden">How it Works</p>
          <p className="text-white text-sm sm:block hidden">Content</p>
        </div>
      )}
      {/* connect wallet button */}
      <div>
        {account ? (
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                isCorrectNetwork
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  : "bg-red-500"
              }`}
            >
              {isCorrectNetwork ? "Sepolia Network" : "Wrong Network"}
            </span>
            <p className="bg-gray-700 px-4 py-2 rounded-full">
              {`${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
            </p>
          </div>
        ) : (
          <button
            className="px-5 py-2.5 font-semibold text-white rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 shadow-lg shadow-indigo-500/30"
            onClick={onConnectWallet}
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
              Connect Wallet
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
