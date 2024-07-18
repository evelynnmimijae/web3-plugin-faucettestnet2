import { Web3 } from "web3";
import crypto from 'crypto';
import { Web3PluginBase, eth, utils } from "web3";

const generateMockPrivateKey = (): string => {
  return '0x' + crypto.randomBytes(32).toString('hex');
};

const mockPrivateKey = generateMockPrivateKey();
console.log(mockPrivateKey);

export class FaucetPlugin extends Web3PluginBase {
  public pluginNamespace = "faucet";
  public web3: Web3;

  constructor(web3Instance: Web3) {
    super();
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

  /**
   * Signs and sends a transaction.
   * @param transaction Prepared transaction object.
   * @param privateKey Private key for signing the transaction.
   * @returns Signed transaction object.
   */
  public async signAndSendTransaction(transaction: any, privateKey: string): Promise<any> {
    const signedTransaction = await this.web3.eth.accounts.signTransaction(transaction, privateKey);
    await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    return signedTransaction;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    faucet: FaucetPlugin;
  }
}
