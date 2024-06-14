# web3.js Faucet Plugin for Testnets 
(created using the [ChainSafe/Web3.js web3-plugin-template](https://github.com/web3/web3.js-plugin-template)) 

## Overview
The Faucet Plugin is a utility designed to facilitate interactions with the Ethereum blockchain through the Web3.js library. It provides functionality for preparing and sending transactions, specifically tailored to request Ether from a faucet. This plugin is part of a larger ecosystem that aims to simplify managing and interacting with Ethereum assets.

Features
Preparation of Transactions: The plugin offers a method to prepare a transaction requesting Ether from a faucet. This involves creating a transaction object with the recipient's address, the amount of Ether requested, and other necessary details such as gas limit and nonce.

Future Features *(the vision)*
User request handling: Request validation—Validates user requests to ensure they meet the criteria for receiving Ether (e.g., valid Ethereum address format). Rate limiting—Implements rate limiting to prevent abuse of the faucet and ensure fair distribution of Ether.

Database integration with Tableland: Address Verification—Checks the Tableland database to verify if a user’s address has already claimed Ether, preventing double-spending. Claim Record Management—Updates the Tableland database to mark an address as having claimed Ether after a successful transaction.

Ethereum Blockchain Interaction: Transaction Sending—Uses web3.js to send transactions from the faucet’s Ethereum address to the user’s address, transferring the requested amount of testnet Ether. Gas Management—Automatically sets appropriate gas prices and gas limits for transactions to ensure they are processed efficiently.

Smart Contract Support (Optional): Contract Interaction—If the faucet uses smart contracts for more complex logic (e.g., time-locked claims), the plugin can interact with these contracts using web3.js. Event Listening—The plugin listens for specific events emitted by the smart contracts to trigger actions (e.g., updating the database when a user claims Ether).

User feedback and Error handling: Confirmation Messages provide feedback to the user upon successful Ether distribution, including the transaction hash for verification. 

Security Measures: Secure Storage of Private Keys—Ensures that the faucet’s private key is securely stored and not exposed, protecting the faucet’s funds. Encryption—Uses encryption for sensitive data, such as API keys for Tableland, to enhance security.

Customization and Extensibility: Customizable Rules allow for customization of rules, such as the amount of Ether distributed per request or the eligibility criteria. 

## Usage
Installation
To use the Faucet Plugin, ensure you have Node.js installed on your system. Then, create a new project directory and initialize a new Node.js project:

`mkdir my-project && cd my-project
npm init -y`

Install the required dependencies
`npm install web3 crypto-js`

Implementation
First, import the necessary modules and define the `FaucetPlugin` class:

```
import Web3 from 'web3';
import crypto from 'crypto';

const generateMockPrivateKey = (): string => {
  return '0x' + crypto.randomBytes(32).toString('hex');
};

const mockPrivateKey = generateMockPrivateKey();

export class FaucetPlugin {
  public pluginNamespace = "faucet";
  public web3: Web3;

  constructor(web3Instance: Web3) {
    this.web3 = web3Instance;
  }

  public async requestEther(address: string, amount: number): Promise<any> {
    // Implementation details...
  }

  public async signAndSendTransaction(transaction: any, privateKey: string): Promise<any> {
    // Implementation details...
  }
}
```
### Example Usage
Here's an example of how to instantiate the FaucetPlugin and use its methods:

```
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const faucetPlugin = new FaucetPlugin(web3);

// Prepare a transaction
const transaction = await faucetPlugin.requestEther('0xRecipientAddress', 10);

// Sign and send the transaction
const signedTransaction = await faucetPlugin.signAndSendTransaction(transaction, mockPrivateKey);
```
### Testing
The Faucet Plugin supports unit testing to ensure its functionality remains intact. Jest is recommended for testing due to its simplicity and integration with JavaScript projects. Install Jest and its types:

`npm install --save-dev jest @types/jest ts-jest`

Configure Jest to work with TypeScript by adding a jest.config.js file:

`module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
`
Write tests for the `FaucetPlugin` methods to verify their correctness and edge cases.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
