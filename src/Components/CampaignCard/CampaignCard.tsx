"use client";

import Image from "next/image";
import { ethers } from "ethers";
import { useState } from "react";

// Step 1: Define the props interface for type safety
type CampaignCardProps = {
  id: number;
  owner: string;
  title: string;
  description: string;
  goal: bigint;
  fundsRaised: bigint;
  completed: boolean;
};

type CampaignProps = {
  campaign: CampaignCardProps;
  onFund: (id: number, amount: string) => void;
  onWithdraw: (id: number) => void;
  currentUser?: string | null;
};

const CampaignCard: React.FC<CampaignProps> = ({
  campaign: { id, owner, title, description, goal, fundsRaised, completed },
  onFund,
  onWithdraw,
  currentUser,
}) => {
  const [fundAmount, setFundAmount] = useState("");
  const campaignGoal = ethers.formatEther(goal);
  const raised = ethers.formatEther(fundsRaised);
  const progress = (Number(raised) / Number(campaignGoal)) * 100;
  const isOwner = currentUser?.toLowerCase() === owner.toLowerCase();
  const goalReached = Number(raised) >= Number(campaignGoal);

  return (
    // Main card container with hover effect
    <div className="bg-[#1C162D] border border-white/10 rounded-2xl overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative w-full h-48">
        <Image
          src={"/campaign-imgs/medical.jpg"}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm mb-2">
          Owner:{" "}
          {`${owner.substring(0, 6)}...${owner.substring(owner.length - 4)}`}
        </p>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{description}</p>

        {/* Progress Bar Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-sm font-medium text-gray-300">
              Raised: {raised} ETH
            </span>
            <span className="text-sm font-medium text-gray-300">
              Goal: {campaignGoal} ETH
            </span>
          </div>
          {/* Progress bar track */}
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            {/* Progress bar fill with gradient - width is set dynamically */}
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
            <p className="text-right text-sm mt-1">{progress.toFixed(2)}%</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <a className="mt-6 block w-full text-center py-2.5 px-6 font-semibold text-gray-300 bg-[#2A2346] rounded-lg hover:bg-[#3A3356] hover:text-white transition-colors duration-200">
            View Campaign
          </a>
        </div>
      </div>

      <div className="p-4">
        {completed ? (
          <p className="text-center text-green-400 font-bold mt-4">
            Campaign Completed & Funds Withdrawn
          </p>
        ) : (
          <div className="mt-4">
            {isOwner ? (
              <button
                onClick={() => onWithdraw(id)}
                disabled={!goalReached}
                className={`w-full font-bold py-2 px-4 rounded-lg ${
                  goalReached
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                {goalReached ? "Withdraw Funds" : "Goal Not Reached"}
              </button>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="ETH"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-2/3 bg-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={() => onFund(id, fundAmount)}
                  className="w-1/3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg"
                >
                  Fund
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
