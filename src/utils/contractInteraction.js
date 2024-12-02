import { ethers } from 'ethers';

// Placeholder contract ABI (you'll need to replace this with the actual ABI after compilation)
const contractABI = [
  "function createBounty(string memory _title, string memory _description) public payable",
  "function claimBounty(uint256 _bountyId) public",
  "event BountyCreated(uint256 indexed bountyId, address indexed creator, string title, uint256 amount)",
  "event BountyClaimed(uint256 indexed bountyId, address indexed claimant)"
];

// Hardcoded contract address for testing (replace with actual deployed contract address)
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

export async function createBounty(provider, title, description, amount) {
  try {
    // Validate inputs
    if (!title || !description || !amount) {
      throw new Error('Invalid bounty details');
    }

    // Get the signer (connected wallet)
    const signer = provider.getSigner();
    
    // Validate signer
    const signerAddress = await signer.getAddress();
    if (!signerAddress) {
      throw new Error('No wallet connected');
    }

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    
    // Convert amount to wei
    const amountInWei = ethers.utils.parseEther(amount.toString());
    
    // Validate contract address
    if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
      throw new Error('Invalid contract address');
    }

    // Call contract method to create bounty
    const tx = await contract.createBounty(title, description, {
      value: amountInWei
    });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.transactionHash,
      // Extract bounty ID from event logs if applicable
      bountyId: receipt.events && receipt.events.length > 0 
        ? receipt.events[0].args.bountyId.toNumber() 
        : null
    };
  } catch (error) {
    console.error('Detailed Error creating bounty:', error);
    
    // Provide more context about the error
    if (error.code === 'INVALID_ARGUMENT') {
      throw new Error('Invalid contract interaction. Check contract address and parameters.');
    }
    
    throw error;
  }
}

export async function getAccountBalance(provider) {
  try {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}

export async function claimBounty(provider, bountyId) {
  try {
    // Get the signer (connected wallet)
    const signer = provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    
    // Call contract method to claim bounty
    const tx = await contract.claimBounty(bountyId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('Error claiming bounty:', error);
    throw error;
  }
}
