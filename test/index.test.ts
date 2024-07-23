import Web3 from "web3";
import { FaucetPlugin } from "../src";

jest.mock("./src/web3Provider", () => ({
  Web3: jest.fn().mockImplementation(() => ({
    eth: {
      getAccounts: jest.fn().mockResolvedValue(['0xMockedAccount']),
      getTransactionCount: jest.fn().mockResolvedValue(0),
      net: {
        getId: jest.fn().mockResolvedValue(1),
      },
      accounts: {
        signTransaction: jest.fn().mockResolvedValue({
          rawTransaction: '0xMockedRawTransaction',
          transactionHash: '0xMockedTxHash',
          to: '0xMockedAddress',
          value: '1000000000000000000',
          gas: 21000,
          from: '0xMockedAccount',
          nonce: 0,
          chainId: 1,
        }),
        sendSignedTransaction: jest.fn().mockResolvedValue({
          transactionHash: '0xMockedTxHash',
        }),
      },
    },
    utils: {
      toWei: jest.fn().mockReturnValue('1000000000000000000'), 
    },
  })),
}));

describe("FaucetPlugin Tests", () => {
  let web3: Web3;
  let faucetPlugin: FaucetPlugin;

  beforeEach(() => {
    jest.clearAllMocks();
    web3 = new Web3(require("ganache-core").provider());
    faucetPlugin = new FaucetPlugin(web3);
  });

  it("should initialize FaucetPlugin with Web3 instance", () => {
    expect(faucetPlugin).toBeDefined();
    expect(faucetPlugin.web3).toEqual(web3);
  });

  it("should prepare a transaction successfully", async () => {
    const address = '0xMockedAddress';
    const amount = 1;
    const transaction = await faucetPlugin.requestEther(address, amount);

    expect(transaction).toMatchObject({
      to: address,
      value: '1000000000000000000',
      gas: 21000,
      from: '0xMockedAccount',
      nonce: 0,
      chainId: 1,
    });
    expect(web3.eth.getAccounts).toHaveBeenCalled();
    expect(web3.eth.getTransactionCount).toHaveBeenCalled();
    expect(web3.eth.net.getId).toHaveBeenCalled();
  });

  it("should sign and send a transaction successfully", async () => {
    const address = '0xMockedAddress';
    const amount = 1;
    await faucetPlugin.requestEther(address, amount);


    expect(web3.eth.sendSignedTransaction).toHaveBeenCalledWith(expect.any(Object));
  });
});
