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
            <div className=' flex flex-col  text-sm mt-20'>
              <a href='https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14#writeContract' rel="noopener" target="_blank">Mint WETH </a>
              <a href='https://sepolia.etherscan.io/address/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984#writeContract' rel="noopener" target="_blank">Mint Uniswap </a>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
