import { Magic } from "magic-sdk";
import { ethers } from "ethers";
import AbstractWeb3Connector from "moralis/lib/browser/Web3Connector/AbstractWeb3Connector";

export default class etherLogin extends AbstractWeb3Connector {
  type = "magicConnect";
  async activate({ email, apiKey, network }) {
    // Cleanup old data if present to avoid using previous sessions
    try {
      await this.deactivate();
    } catch (error) {
      // Do nothing
    }

    const magic = new Magic(apiKey, {
      network: network,
    });
    const ether = new ethers.providers.Web3Provider(magic.rpcProvider);
    await magic.auth.loginWithMagicLink({
      email: email,
    });
    const loggedIn = await magic.user.isLoggedIn();
    if (loggedIn) {
      //Get constants
      const signer = ether.getSigner();
      const { chainId } = await ether.getNetwork();
      const address = (await signer.getAddress()).toLowerCase();
      // Assing Constants
      this.account = address;
      this.provider = ether.provider;
      this.chainId = `$0x${chainId.toString(16)}`;
      console.log(address);
      // Assign magic user for deactivation
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
  }

  deactivate = async () => {
    this.unsubscribeToEvents(this.provider);
    if (this.magicUser) {
      await this.magicUser.user.logout();
    }
    this.account = null;
    this.chainId = null;
    console.log("Loggged Out");
  };
}
