import "../styles/globals.css";
import { useMoralis, MoralisProvider } from "react-moralis";
import { Magic } from "magic-sdk";
import { ethers } from "ethers";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId="PeZSnjgeqGs611I9ScLTccik3iUFKYlLnnqwiztb"
      serverUrl="https://xhxnqo3ef7qp.usemoralis.com:2053/server"
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
