import './App.css';
import { useState } from "react"
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Swap from './components/Swap';
import AddToken from "./components/AddToken";

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'Uniswap-V3',
  projectId: 'f80a4a1fd388922ed2f051bbf7c82bce',
  chains: [sepolia],
});

function App() {
  const [changePage, setchangePage] = useState<boolean>(false);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="App">
            <div className='flex flex-row text-xl px-5 fixed top-10 left-10'>
              <button onClick={() => { setchangePage(false) }} className={`mx-4 ${changePage === false ? "underline-offset-2 underline" : ""}`}>Swap</button>
              <button onClick={() => { setchangePage(true) }} className={`mx-4 ${changePage === true ? "underline-offset-2 underline" : ""}`}>Add Token</button>
            </div>
            <div className='fixed top-10 right-10 scale-75'>
              <ConnectButton />
            </div>
            {
              !changePage ?
                <Swap />
                :
                <AddToken />
            }
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
