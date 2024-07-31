import { FaucetPlugin } from "../src/FaucetPlugin"; // Assuming FaucetPlugin is in src folder
import Web3 from "web3";
import * as crypto from 'crypto'; // Import crypto module correctly

describe("FaucetPlugin", () => {
  let web3: Web3;
  let faucetPlugin: FaucetPlugin;

  beforeEach(() => {
    web3 = new Web3("http://localhost:8545");
    faucetPlugin = new FaucetPlugin(web3);
  });

  it("should prepare a transaction successfully", async () => {
    const address = "0xMockedAddress";
    const amount = 1;
    const transaction = await faucetPlugin.requestEther(address, amount);

    expect(transaction).toMatchObject({
      to: address,
      value: web3.utils.toWei(amount.toString(), "ether"),
      gas: 21000,
    });
  });

  it("should sign and send a transaction successfully", async () => {
    const address = "0xMockedAddress";
    const amount = 1;
    const transaction = await faucetPlugin.requestEther(address, amount);
    const privateKey = "0x" + crypto.randomBytes(32).toString("hex");
    const signedTransaction = await faucetPlugin.signAndSendTransaction(transaction, privateKey);

    expect(signedTransaction).toBeDefined();
  });
});
