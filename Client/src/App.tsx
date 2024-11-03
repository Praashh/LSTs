import HomePage from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import NavBar from "./components/Navbar";
import Stake from "./pages/Stake";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = "https://api.devnet.solana.com";

  const wallets = useMemo(() => [], [network]);

  return (
    <>
      <BrowserRouter>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stake" element={<Stake />} />
            </Routes>
          </WalletProvider>
        </ConnectionProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
