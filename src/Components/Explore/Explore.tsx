import React from "react";
import CampaignCard from "../CampaignCard/CampaignCard";

// mock data for campaigns
const campaigns = [
  {
    id: 1,
    imageUrl: "/campaign-imgs/art.jpg",
    title: "Campaign 1",
    description: "Description for campaign 1",
    amountRaised: "$5,000",
    percentageFunded: 50,
    campaignUrl: "/campaigns/1",
  },
  {
    id: 2,
    imageUrl: "/campaign-imgs/medical.jpg",
    title: "Campaign 2",
    description: "Description for campaign 2",
    amountRaised: "$10,000",
    percentageFunded: 75,
    campaignUrl: "/campaigns/2",
  },
  {
    id: 3,
    imageUrl: "/campaign-imgs/sport.jpg",
    title: "Campaign 3",
    description: "Description for campaign 3",
    amountRaised: "$15,000",
    percentageFunded: 90,
    campaignUrl: "/campaigns/3",
  },
];

type Campaign = {
  id: number;
  owner: string;
  title: string;
  description: string;
  goal: bigint;
  fundsRaised: bigint;
  completed: boolean;
};

type ExploreProps = {
  campaigns: Campaign[];
  isCorrectNetwork: boolean;
  onFund: (id: number, amount: string) => void;
  onWithdraw: (id: number) => void;
  currentUser?: string | null;
};

const Explore = ({
  campaigns,
  isCorrectNetwork,
  onFund,
  onWithdraw,
  currentUser,
}: ExploreProps) => {
  return (
    <div className="px-10">
      <h1 className="text-3xl font-bold text-white text-center">
        Explore Campaigns
      </h1>
      <p className="text-lg text-gray-400 text-center">
        Discover and support the next wave of innovation.
      </p>

      <section>
        {/* <h2 className="text-3xl font-semibold mb-6 text-center">
          Active Campaigns
        </h2> */}
        {isCorrectNetwork ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                campaign={campaign}
                onFund={onFund}
                onWithdraw={onWithdraw}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-5 text-2xl">
            Connect to the Sepolia network to view campaigns.
          </p>
        )}
      </section>
    </div>
  );
};

export default Explore;
