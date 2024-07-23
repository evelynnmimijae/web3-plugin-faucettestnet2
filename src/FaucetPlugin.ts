// src/FaucetPlugin.ts

import Web3 from "web3";

export class FaucetPlugin {
    web3: Web3;
  
    constructor(web3: Web3) {
      this.web3 = web3;
    }
  
    async requestEther(address: string, amount: number) {
      const accounts = await this.web3.eth.getAccounts();
      const nonce = await this.web3.eth.getTransactionCount(accounts[0]);
      const chainId = await this.web3.eth.net.getId();
      const value = this.web3.utils.toWei(amount.toString(), 'ether');
  
      const transaction = {
        to: address,
        value,
        gas: 21000,
        from: accounts[0],
        nonce,
        chainId,
      };
  
      const signedTransaction = await this.web3.eth.accounts.signTransaction(transaction, 'privateKey');
      const receipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
      return receipt;
    }
  }
  