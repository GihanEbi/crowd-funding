# 🚀 Decentralized Crowdfunding Platform

A blockchain-based crowdfunding application that enables users to create, fund, and manage campaigns in a transparent and decentralized manner. Built with Next.js, React, TypeScript, and Ethereum smart contracts.

![Crowdfunding Platform](./public/logo/logo.png)

## 🌟 Features

- **🔗 Blockchain Integration**: Built on Ethereum with smart contract functionality
- **💳 Web3 Wallet Support**: Connect with MetaMask and other Web3 wallets
- **📊 Campaign Management**: Create, view, and fund campaigns with real-time updates
- **🎨 Modern UI/UX**: Beautiful, responsive interface built with Tailwind CSS
- **🔒 Secure Transactions**: All transactions are secured by blockchain technology
- **📱 Mobile Responsive**: Works seamlessly across desktop and mobile devices
- **⚡ Fast Performance**: Optimized with Next.js 15 and Turbopack

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI, Heroicons, Lucide React
- **State Management**: React Hooks

### Blockchain
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Web3 Library**: Ethers.js v6
- **Smart Contract**: Custom Crowdfunding Contract

### Development Tools
- **Build Tool**: Turbopack
- **Linting**: ESLint 9
- **Package Manager**: npm/yarn/pnpm

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- MetaMask or another Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crowd-funding.git
   cd crowd-funding
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x776D999Dc83b22261b841ff6cD173BBC01957806
   NEXT_PUBLIC_NETWORK_ID=11155111
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Wallet Setup
1. Install MetaMask browser extension
2. Create or import your wallet
3. Switch to Sepolia testnet
4. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Smart Contract
The application is connected to a crowdfunding smart contract deployed on Sepolia testnet:
- **Contract Address**: `0x776D999Dc83b22261b841ff6cD173BBC01957806`
- **Network**: Sepolia (Chain ID: 11155111)

## 📱 Usage

### Creating a Campaign
1. Connect your Web3 wallet
2. Click "Get Started" or navigate to "New Campaign"
3. Fill in campaign details:
   - Title and description
   - Funding goal (in ETH)
   - Campaign duration
4. Submit transaction and pay gas fees
5. Your campaign will be live on the blockchain

### Funding a Campaign
1. Browse available campaigns in the "Explore" section
2. Click on a campaign to view details
3. Enter the amount you want to contribute
4. Confirm the transaction in your wallet
5. Your contribution will be recorded on the blockchain

### Managing Campaigns
- View all your created campaigns
- Monitor funding progress
- Withdraw funds when goals are met
- Track contributor information

## 📁 Project Structure

```
crowd-funding/
├── public/                 # Static assets
│   ├── logo/              # Logo images
│   └── campaign-imgs/     # Campaign placeholder images
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # Homepage
│   │   ├── layout.tsx     # Root layout
│   │   └── new-campaign/  # Campaign creation page
│   ├── Components/        # React components
│   │   ├── Hero/          # Landing page hero
│   │   ├── NavBar/        # Navigation component
│   │   ├── CampaignCard/  # Campaign display card
│   │   ├── Explore/       # Campaign browser
│   │   └── ui/            # Reusable UI components
│   └── lib/               # Utilities and configurations
│       ├── abi.js         # Smart contract ABI
│       └── utils.ts       # Helper functions
├── components.json        # shadcn/ui configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── next.config.ts         # Next.js configuration
```

## 🎯 Key Components

- **Hero**: Landing page with call-to-action buttons
- **NavBar**: Navigation with wallet connection
- **CampaignCard**: Displays campaign information and funding progress
- **Explore**: Browse and filter available campaigns
- **AlertDialog**: User notifications and confirmations
- **Loader**: Loading states for blockchain transactions

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build the application
npm run build

# Start production server
npm start
```

## 📦 Build and Deployment

### Build for Production
```bash
npm run build
```

### Deploy on Vercel
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy on Other Platforms
The application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

We welcome contributions to improve the platform! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration provided
- Write clean, documented code
- Test thoroughly before submitting

## 🐛 Known Issues

- MetaMask connection might require page refresh on first connect
- Transaction confirmations can be slow on Sepolia testnet
- Mobile wallet support varies by wallet provider

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://crowd-funding-ecru.vercel.app/]
- **Smart Contract**: [Etherscan Link](https://sepolia.etherscan.io/address/0x776D999Dc83b22261b841ff6cD173BBC01957806)

## 👥 Team

- **Gihan Piumal** - [GitHub](https://github.com/GihanEbi) - [LinkedIn](https://linkedin.com/in/gihan-piumal)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact us at [https://my-portfolio-six-rho-85.vercel.app/]
- Join our [Discord/Telegram community]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Ethers.js](https://ethers.org) for blockchain integration
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Radix UI](https://radix-ui.com) for accessible components
- The Ethereum community for blockchain infrastructure

---

**Happy Crowdfunding! 🎉**

*Building the future of decentralized fundraising, one block at a time.*
