import React, { useState } from 'react';
import { createCoin } from "@zoralabs/coins-sdk";
import { usePublicClient, useWalletClient, useSwitchChain, useChainId, useAccount } from "wagmi";
import { baseSepolia } from 'wagmi/chains';

const CreateCoinComponent = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  
  const [tokenAddress, setTokenAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base Sepolia chain ID
  const REQUIRED_CHAIN_ID = baseSepolia.id; // 84532

  const coinParams = {
    name: "My Awesome Coin",
    symbol: "MAC",
    uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
    payoutRecipient: "0x64b54e5F425AAe4F5cF0F183ea2D29C87a1cFC8f" ,
  };

  const switchToBaseSepolia = async () => {
    try {
      await switchChain({ chainId: REQUIRED_CHAIN_ID });
      console.log("Successfully switched to Base Sepolia");
    } catch (switchError) {
      console.error("Failed to switch chain:", switchError);
      setError(`Failed to switch to Base Sepolia: ${switchError.message}`);
    }
  };


  //   buy coin

//   const buyParams = {
//     direction: "buy",
//     target: "0xCoinContractAddress" as Address,
//     args: {
//       recipient: "0xYourAddress" as Address, // Where to receive the purchased coins
//       orderSize: parseEther("0.1"), // Amount of ETH to spend
//       minAmountOut: 0n, // Minimum amount of coins to receive (0 = no minimum)
//       tradeReferrer: "0xOptionalReferrerAddress" as Address, // Optional
//     }
//   };





  const handleCreateCoin = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!walletClient || !publicClient) {
      setError("Wallet client or public client not available");
      return;
    }
    
    // Check if we're on the correct chain
    if (chainId !== REQUIRED_CHAIN_ID) {
      setError(`Please switch to Base Sepolia network (current: ${chainId})`);
      return;
    }
    
    setLoading(true);
    setTokenAddress(null);
    setError(null);
    
    try {
      console.log("Creating coin with parameters:", coinParams);
      console.log("Current chain ID:", chainId);
      
      // Use the createCoin function with walletClient and publicClient
      const result = await createCoin(
        coinParams,
        walletClient,
        publicClient,
        { gasMultiplier: 120 }
      );
      
      console.log("Transaction hash:", result.hash);
      console.log("Coin deployed at:", result.address);
      
      if (result.address) {
        setTokenAddress(result.address);
      } else {
        setError("Token deployment failed or address not found");
      }
    } catch (err) {
      console.error("Error creating coin:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Display current network status
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;

  return (
    <div style={{ textAlign: 'center', padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <strong>Network Status:</strong> {isConnected ? (
          isCorrectNetwork ? 
            <span style={{ color: "#2ecc71" }}>Connected to Base Sepolia ✓</span> : 
            <span style={{ color: "#e74c3c" }}>Wrong Network (Current ID: {chainId}) ✗</span>
        ) : <span style={{ color: "#e74c3c" }}>Not Connected ✗</span>}
      </div>
      
      {!isCorrectNetwork && isConnected && (
        <button 
          onClick={switchToBaseSepolia}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            fontSize: "16px",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Switch to Base Sepolia
        </button>
      )}
      
      <button 
        onClick={handleCreateCoin}
        disabled={loading || !isCorrectNetwork || !isConnected}
        style={{
          backgroundColor: isCorrectNetwork && isConnected ? "#4CAF50" : "#95a5a6",
          color: "white",
          fontSize: "20px",
          margin: "20px",
          padding: "16px 32px",
          border: "none",
          borderRadius: "8px",
          cursor: isCorrectNetwork && isConnected && !loading ? "pointer" : "not-allowed",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Creating..." : "Create Coin"}
      </button>
      
      {tokenAddress && (
        <div style={{ marginTop: "20px", color: "#2ecc71" }}>
          ✅ Token deployed at: <code>{tokenAddress}</code>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: "20px", color: "#e74c3c" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default CreateCoinComponent;