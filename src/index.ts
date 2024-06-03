import { Web3PluginBase, Web3EthPluginBase } from "web3";
import { Web3 } from "web3"; 

export class TemplatePlugin extends Web3PluginBase {
  public pluginNamespace = "template";

  public test(param: string): void {
    console.log(param);
  }
}

export class FaucetPlugin extends Web3EthPluginBase {
  public pluginNamespace = "faucet";
  private web3: Web3; 

  constructor(web3Instance: Web3) {
    super();
    this.web3 = web3Instance; 
  }

  public async requestEther(address: string, amount: number): Promise<any> {
    const transaction = {
      to: address,
      value: this.web3.utils.toWei(amount.toString(), 'ether'),
      gas: 21000,
    };

    const accounts = await this.web3.eth.getAccounts();
    const receipt = await this.web3.eth.sendTransaction({
      ...transaction,
      from: accounts[0],
    });

    return receipt;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    template: TemplatePlugin;
    faucet: FaucetPlugin;
  }
}
