import { useAccount, useConnect, useDisconnect } from 'wagmi';
import * as React from "react";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { useWriteContract, useSimulateContract } from "wagmi";
import CreateCoinComponent from "./CreateCoinComponent.jsx";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      display: "flex",
      color: "#333",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
    },
    container: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "16px",
      maxWidth: "700px",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      fontSize: "36px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
      color: "#2c5364",
      letterSpacing: "1px",
    },
    section: {
      marginBottom: "30px",
    
    },
    label: {
      fontWeight: "600",
      color: "#333",
    },
    info: {
      backgroundColor: "#f1f1f1",
      padding: "15px",
      borderRadius: "8px",
      marginTop: "10px",
      fontSize: "15px",
      lineHeight: "1.6",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "6px",
      marginTop: "15px",
      marginRight: "10px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      
    },
    disconnectButton: {
      backgroundColor: "#e63946",
    },
    buttonHover: {
      backgroundColor: "#357a38",
    },
    connectButton: {
      backgroundColor: "#1d3557",
    },
    createb:{
      display: "flex",
      justifyContent : "center",
    },
    error: {
      color: "red",
      marginTop: "10px",
      fontSize: "14px",
    },
    connectBtnWrapper: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "15px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Token Launchpad 🚀</h1>

        <div style={styles.section}>
          <div style={styles.createb}>

          <CreateCoinComponent />
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.label}>Account Details</h3>
          <div style={styles.info}>
            <p><strong>Status:</strong> {account.status}</p>
            <p><strong>Address:</strong> {JSON.stringify(account.addresses)}</p>
            <p><strong>Chain ID:</strong> {account.chainId}</p>
          </div>
          {account.status === 'connected' && (
            <button
              style={{ ...styles.button, ...styles.disconnectButton }}
              onClick={() => disconnect()}
            >
              🔌 Disconnect
            </button>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.label}>Connect Wallet</h3>
          <div style={styles.connectBtnWrapper}>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                style={{ ...styles.button, ...styles.connectButton }}
              >
                🔗 {connector.name}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "10px" }}>{status}</div>
          {error && <div style={styles.error}>⚠️ {error.message}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
