import { useAccount, useConnect, useDisconnect } from 'wagmi'
import * as React from "react";
import { createCoinCall } from "@zoralabs/coins-sdk";

import { useWriteContract, useSimulateContract } from "wagmi";
import CreateCoinComponent from "./CreateCoinComponent.jsx";



function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()



  
  return (
    <>
      <div>
        <h2>Account</h2>
      {/* <button onClick={CreateCoinComponent()}>creat coin</button> */}
      <CreateCoinComponent/>
        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  )
}

export default App
