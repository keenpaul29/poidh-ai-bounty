import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Input, Button, Text, Select, useToast, Flex } from '@chakra-ui/react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';
import { generateBountyIdea } from './api/generate.js';
import { createBounty, getAccountBalance } from './utils/contractInteraction.js';

// Create the injected connector for MetaMask
const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 137, 80001], // Ethereum Mainnet, Goerli, Polygon Mainnet, Mumbai
});

// Helper function to get library (provider)
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function WalletConnectionButton() {
  const { activate, active, account, deactivate, library } = useWeb3React();
  const [balance, setBalance] = useState('0');
  const toast = useToast();

  useEffect(() => {
    const fetchBalance = async () => {
      if (active && library) {
        try {
          const accountBalance = await getAccountBalance(library);
          setBalance(accountBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [active, library]);

  const connectWallet = async () => {
    try {
      await activate(injected);
      toast({
        title: 'Wallet Connected',
        description: `Connected with ${account}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const disconnectWallet = () => {
    deactivate();
    setBalance('0');
    toast({
      title: 'Wallet Disconnected',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex direction="column" w="full">
      <Button 
        onClick={active ? disconnectWallet : connectWallet} 
        colorScheme={active ? 'red' : 'green'}
        w="full"
        mb={2}
      >
        {active ? `Disconnect (${account?.substring(0, 6)}...)` : 'Connect Wallet'}
      </Button>
      {active && (
        <Text fontSize="sm" textAlign="center">
          Balance: {parseFloat(balance).toFixed(4)} ETH
        </Text>
      )}
    </Flex>
  );
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [bountyIdea, setBountyIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const { active, library } = useWeb3React();
  const toast = useToast();

  const handleGenerateBounty = async () => {
    setLoading(true);
    try {
      const idea = await generateBountyIdea(prompt);
      setBountyIdea(idea);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const submitBounty = async () => {
    if (!active) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!bountyIdea || !amount) {
      toast({
        title: 'Incomplete Bounty',
        description: 'Please generate a bounty and set an amount',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await createBounty(
        library, 
        bountyIdea.title, 
        bountyIdea.description, 
        amount
      );

      toast({
        title: 'Bounty Created',
        description: `Bounty submitted on ${chain}. Transaction Hash: ${result.transactionHash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <VStack spacing={6} p={8} maxW="600px" mx="auto">
        <Text fontSize="2xl" fontWeight="bold">POIDH AI Bounty Generator</Text>
        
        <WalletConnectionButton />

        <Input
          placeholder="What should the bounty be about?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          size="lg"
        />
        
        <Button
          colorScheme="blue"
          onClick={handleGenerateBounty}
          isLoading={loading}
          w="full"
        >
          Generate Bounty Idea
        </Button>

        {bountyIdea && (
          <Box w="full" p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold" fontSize="xl">{bountyIdea.title}</Text>
            <Text mt={2}>{bountyIdea.description}</Text>
            
            <Select
              mt={4}
              value={chain}
              onChange={(e) => setChain(e.target.value)}
            >
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
            </Select>
            
            <Input
              mt={4}
              placeholder={`Amount in ${chain === 'ethereum' ? 'ETH' : 'DEGEN'}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
            />
            
            <Button 
              mt={4} 
              w="full" 
              colorScheme="green" 
              onClick={submitBounty}
              isDisabled={!active}
            >
              {active ? 'Submit Bounty' : 'Connect Wallet to Submit'}
            </Button>
          </Box>
        )}
      </VStack>
    </ChakraProvider>
  );
}

function WrappedApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  );
}

export default WrappedApp;
