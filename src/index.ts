import { Web3 } from "web3"; 
import crypto from 'crypto';

const generateMockPrivateKey = (): string => {
  return '0x' + crypto.randomBytes(32).toString('hex');
};

const mockPrivateKey = generateMockPrivateKey();
console.log(mockPrivateKey);
export class TemplatePlugin {
  public pluginNamespace = "faucetplugin";
  public web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public test(param: string): void {
    console.log(param);
  }
}
export class FaucetPlugin {
  public pluginNamespace = "faucet";
  public web3: Web3;

  constructor(web3Instance: Web3) {
    this.web3 = web3Instance; 
  }

    /**
   * Prepares a transaction for requesting Ether from the faucet without sending it.
   * @param address Recipient's Ethereum address.
   * @param amount Amount of Ether to request in Wei.
   * @returns Prepared transaction object.
   */

  public async requestEther(address: string, amount: number): Promise<any> {
    const transaction = {
      to: address,
      value: this.web3.utils.toWei(amount.toString(), 'ether'),
      gas: 21000,
    };

    const accounts = await this.web3.eth.getAccounts();
    const nonce = await this.web3.eth.getTransactionCount(accounts[0]);
    const chainId = await this.web3.eth.net.getId();

    return {
     ...transaction,
      from: accounts[0],
      nonce,
      chainId,
    };
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    template: TemplatePlugin;
    faucet: FaucetPlugin;
  }
}