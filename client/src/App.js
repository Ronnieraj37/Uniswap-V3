import './App.css';
import Swap from './components/Swap';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Uniswap-V3',
  projectId: 'f80a4a1fd388922ed2f051bbf7c82bce',
  chains: [sepolia],
  ssr: true,
});
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="App">
            <ConnectButton />
            <Swap />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
