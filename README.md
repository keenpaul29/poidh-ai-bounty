# POIDH AI Bounty Generator

A web application that helps users generate blockchain bounty ideas using AI and submit them to POIDH.

## Features

- AI-powered bounty idea generation using Groq's Mixtral model
- Web3 wallet integration
- Support for ETH and DEGEN tokens
- Direct submission to POIDH platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter a prompt describing what kind of bounty you want to create
2. Click "Generate Bounty Idea" to get AI-generated title and description
3. Select your preferred blockchain and token
4. Connect your Web3 wallet
5. Submit the bounty to POIDH

## Requirements

- Node.js 14+
- MetaMask or other Web3 wallet
- Groq API key

## Blockchain Bounty Submission

1. Connect your Web3 wallet (MetaMask)
2. Generate a bounty idea using AI
3. Set bounty amount in ETH
4. Click "Submit Bounty" to create on-chain bounty

### Smart Contract Features
- Create bounties with AI-generated titles and descriptions
- Set bounty amount in ETH
- Support for Ethereum and Polygon networks
- Secure, non-reentrant bounty claiming mechanism

### Wallet Balance
- View your current ETH balance
- Supports wallet connection/disconnection
- Real-time balance updates

## Wallet Connection

1. Install MetaMask browser extension
2. Create a MetaMask wallet
3. Ensure you're on the correct network (Ethereum or Polygon)
4. Click "Connect Wallet" in the application
5. Approve the connection in MetaMask

## Troubleshooting
- Ensure sufficient ETH balance for gas fees
- Check network compatibility
- Verify MetaMask is configured correctly

## Troubleshooting Wallet Connection

- Ensure MetaMask is installed
- Check that you're on a supported network
- Verify MetaMask is unlocked
- Refresh the page and try reconnecting
