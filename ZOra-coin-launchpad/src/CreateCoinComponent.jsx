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

import React from 'react';
import { createCoinCall } from "@zoralabs/coins-sdk";
import { useWriteContract, useSimulateContract } from "wagmi";

const CreateCoinComponent = () => {
    const { writeContractAsync } = useWriteContract();

    const coinParams = {
        name: "My Awesome Coin",
        symbol: "MAC",
        uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
        payoutRecipient: "0x64b54e5F425AAe4F5cF0F183ea2D29C87a1cFC8f", // Replace with your address
        // platformReferrer: "0xOptionalPlatformReferrerAddress", // Optional
    };

    const contractCallParams = createCoinCall(coinParams);

    const handleCreateCoin = async () => {
        try {
            const result = await writeContractAsync(contractCallParams);
            console.log("Coin created successfully:", result);
        } catch (error) {
            console.error("Error creating coin:", error);
        }
    };

    return (
        <div>
            <button onClick={handleCreateCoin}>Create Coin</button>
        </div>
    );
};

export default CreateCoinComponent;