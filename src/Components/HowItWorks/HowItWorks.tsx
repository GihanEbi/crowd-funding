// components/HowItWorksSection.tsx

import React from "react";
// We'll use icons from the heroicons library
import {
  Bars3BottomLeftIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// --- Reusable Sub-component for a single step ---

// 1. Define the props for a single step for type safety
interface ProcessStepProps {
  icon: React.ReactNode;
  stepNumber: number;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  icon,
  stepNumber,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon Wrapper */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1C162D] border border-white/10">
        {/* Apply size and color to this wrapper div */}
        <div className="w-8 h-8 text-indigo-400">{icon}</div>
      </div>
      {/* Text Content */}
      <h3 className="text-lg font-bold text-white">
        {stepNumber}. {title}
      </h3>
      <p className="mt-2 text-sm text-gray-400 max-w-xs">{description}</p>
    </div>
  );
};

// --- Main Section Component ---

const HowItWorksSection = () => {
  // 2. Store step data in an array of objects. This makes it easy to manage.
  const stepsData: Omit<ProcessStepProps, "stepNumber">[] = [
    {
      icon: <Bars3BottomLeftIcon />,
      title: "Create Campaign",
      description:
        "Project creators submit their ideas, set funding goals, and define milestones.",
    },
    {
      icon: <UsersIcon />,
      title: "Fund Project",
      description:
        "Backers explore campaigns and contribute funds directly using their crypto wallets.",
    },
    {
      icon: <ShieldCheckIcon />,
      title: "Release Funds",
      description:
        "Funds are held in a smart contract and released to creators upon meeting milestones.",
    },
  ];

  return (
    <section className="bg-[#0A0517] py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-gray-400">
            A simple and transparent process for creators and backers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {/* 3. Map over the data array to render each step */}
          {stepsData.map((step, index) => (
            <ProcessStep
              key={step.title}
              stepNumber={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
