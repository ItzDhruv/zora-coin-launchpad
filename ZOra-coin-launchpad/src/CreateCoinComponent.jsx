// import { createCoinCall } from "@zoralabs/coins-sdk";

// import { useWriteContract, useSimulateContract } from "wagmi";


// const coinParams = {
//   name: "My Awesome Coin",
//   symbol: "MAC",
//   uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
//   payoutRecipient: "0xYourAddress",
//   platformReferrer: "0xOptionalPlatformReferrerAddress",
// };
 
// // Create configuration for wagmi
// const contractCallParams = createCoinCall(coinParams);
 
// // In your component
// function CreateCoinComponent() {
//   const { data: writeConfig } = useSimulateContract({
//     ...contractCallParams,
//   });
  
//   const { writeContract, status } = useWriteContract(writeConfig);
  
//   return (
//     <button disabled={!writeContract || status !== 'pending'} onClick={() => writeContract?.()}>
//       {status === 'pending' ? 'Creating...' : 'Create Coin'}
//     </button>
//   );
// }

// export default CreateCoinComponent;

// import React from 'react';
// import { createCoinCall } from "@zoralabs/coins-sdk";
// import { useWriteContract, useSimulateContract, usePublicClient, } from "wagmi";
// import { getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
// const CreateCoinComponent = () => {
//     const { writeContractAsync } = useWriteContract();
    
//     const publicClient = usePublicClient();
//     const coinParams = {
//         name: "My Awesome Coin",
//         symbol: "MAC",
//         uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
//         payoutRecipient: "0x64b54e5F425AAe4F5cF0F183ea2D29C87a1cFC8f", // Replace with your address
//         // platformReferrer: "0xOptionalPlatformReferrerAddress", // Optional
//     };

//     const contractCallParams =  createCoinCall(coinParams, walletClient, publicClient);
//     const handleCreateCoin = async () => {
//         try {
//             const result = await writeContractAsync(contractCallParams);
//             console.log("Coin tx hash", result);
//             const coinDeployment = getCoinCreateFromLogs(contractCallParams);
//             console.log("Coin deployed at:", coinDeployment?.coin);

        
             
//         } catch (error) {
//             console.error("Error creating coin:", error);
//         }
//     };

//     return (
//         <div>
//           <button
//   onClick={handleCreateCoin}
//   style={{
//     backgroundColor: "#4CAF50",
//     color: "white",
//     fontSize: "20px",
//     padding: "16px 32px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
//     transition: "background-color 0.3s ease",
    
//   }}
// >
//  Create Coin
// </button>

//         </div>
//     );
// };

// export default CreateCoinComponent;






import React, { useState } from 'react';
import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { useWriteContract, usePublicClient, useWalletClient } from "wagmi";

const CreateCoinComponent = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [tokenAddress, setTokenAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const coinParams = {
    name: "My Awesome Coin",
    symbol: "MAC",
    uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
    payoutRecipient: "0x64b54e5F425AAe4F5cF0F183ea2D29C87a1cFC8f", // Replace with your address
    // platformReferrer: "0x..." // Optional
  };

  const handleCreateCoin = async () => {
    if (!walletClient || !publicClient) {
      alert("Wallet client or public client not available.");
      return;
    }

    setLoading(true);
    setTokenAddress(null);
    setError(null);

    try {
      const contractCallParams = createCoinCall(coinParams, walletClient, publicClient);
      const txHash = await writeContractAsync(contractCallParams);
      console.log("Transaction hash:", txHash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      const coinDeployment = getCoinCreateFromLogs(receipt);

      if (coinDeployment?.coin) {
        setTokenAddress(coinDeployment.coin);
        console.log("Coin deployed at:", coinDeployment.coin);
      } else {
        setError("Token deployment failed or logs not found.");
      }
    } catch (err) {
      console.error("Error creating coin:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handleCreateCoin}
        disabled={loading}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "20px",
          padding: "16px 32px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease",
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
        <div style={{ marginTop: "20px", color: "red" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default CreateCoinComponent;
