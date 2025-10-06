import React from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative bg-[#0A0517] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* The Glow Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3">
        <div className="w-[600px] h-[600px] bg-purple-900 rounded-full blur-3xl opacity-25"></div>
      </div>

      {/* Your Content (on top) */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold leading-tight">
          Decentralized Crowdfunding for a
          <br />
          Better Future
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Fund and launch innovative projects on the blockchain. Transparent,
          secure, and community-driven.
        </p>
        <div className="mt-6 flex justify-center gap-5">
          <button
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-3xl shadow-lg shadow-indigo-500/30"
            onClick={() => router.push("/new-campaign")}
          >
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-3xl shadow-lg">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
