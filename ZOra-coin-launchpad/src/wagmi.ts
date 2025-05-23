import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, zora, zoraTestnet, baseSepolia} from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, zoraTestnet],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [zoraTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
