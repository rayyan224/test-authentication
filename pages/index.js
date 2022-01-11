import React, { useEffect, useState } from "react";
import { useMoralis, MoralisProvider } from "react-moralis";
import { Magic } from "magic-sdk";
import AbstractWeb3Connector from "moralis/lib/browser/Web3Connector/AbstractWeb3Connector";
import Web3 from "web3";

class magicLoginWeb3 extends AbstractWeb3Connector {
  type = "magiConnect";
  activate = async ({ email, apiKey, network } = {}) => {
    const magic = new Magic(apiKey, network);
    const web3 = new Web3(magic.rpcProvider);
    await magic.auth.loginWithMagicLink({
      email,
    });
    const loggedIn = await magic.user.isLoggedIn();
    if (loggedIn) {
      // Get Constants
      const address = (await web3.eth.getAccounts())[0].toLowerCase();
      const chainId = web3.eth.net.getId();
      // Set Constants
      this.account = address;
      this.provider = web3.currentProvider;
      this.chainId = `$0x${chainId.toString(16)}`;
      this.magicUser = magic;
      this.subscribeToEvents(this.provider);
      console.log("Logged in");
      return {
        provider: this.provider,
        account: this.account,
        chainId: this.chainId,
      };
    }

    throw "something went wrong on login";
  };
  deactivate = async () => {
    this.unsubscribeToEvents(this.provider);
    // await this.magicUser.user.logout();
    if (this.magicUser) {
      await this.magicUser.user.logout();
    }
    this.account = null;
    this.chainId = null;
    console.log("Loggged Out");
  };
}

export default function Home() {
  const { Moralis, logout } = useMoralis();
  const [email, setEmail] = useState("");
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div>
      <button
        onClick={async () => {
          setEmail("");
          await logout();
        }}
      >
        Sign Out
      </button>
      <div>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await Moralis.authenticate({
              connector: magicLoginWeb3,
              email: email,
              apiKey: "pk_test_7967AF810E630E08",
              network: "kovan",
            });
          }}
        >
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={handleInputChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
