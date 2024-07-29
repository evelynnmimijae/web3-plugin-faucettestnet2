import Web3 from "web3";
import { FaucetPlugin } from "../src";
import ganache from "ganache-core"; // Importing ganache-core

jest.mock("../src/web3Provider", () => ({
  Web3: jest.fn().mockImplementation(() => ({
    eth: {
      getAccounts: jest.fn().mockResolvedValue(['0xMockedAccount']),
      getTransactionCount: jest.fn().mockResolvedValue(0n),
      net: {
        getId: jest.fn().mockResolvedValue(1n),
      },
      accounts: {
        signTransaction: jest.fn().mockResolvedValue({
          rawTransaction: '0xMockedRawTransaction',
          transactionHash: '0xMockedTxHash',
          to: '0xMockedAddress',
          value: '1000000000000000000',
          gas: 21000,
          from: '0xMockedAccount',
          nonce: 0n,
          chainId: 1n,
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
  let provider: any;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = ganache.provider();
    web3 = new Web3(provider);
    faucetPlugin = new FaucetPlugin(web3);

    jest.spyOn(web3.eth.accounts, 'sendSignedTransaction');
  });

  afterEach(() => {
    if (provider && provider.close) {
      provider.close();
    }
  });

  it("should initialize FaucetPlugin with Web3 instance", () => {
    expect(faucetPlugin).toBeDefined();
    expect(faucetPlugin.web3).toEqual(web3);
  });

  it("should prepare a transaction successfully", async () => {
    const address = '0xMockedAddress';
    const transaction = await faucetPlugin.requestEther(address, 1);

    expect(transaction).toMatchObject({
      to: address,
      value: '1000000000000000000',
      gas: 21000,
      from: '0xMockedAccount',
      nonce: 0n,
      chainId: 1n,
    });
    expect(web3.eth.getAccounts).toHaveBeenCalled();
    expect(web3.eth.getTransactionCount).toHaveBeenCalled();
    expect(web3.eth.net.getId).toHaveBeenCalled();
  });

  it("should sign and send a transaction successfully", async () => {
    const address = '0xMockedAddress';
    await faucetPlugin.requestEther(address, 1);

    expect(web3.eth.accounts.sendSignedTransaction).toHaveBeenCalledWith(expect.any(String));
  });
});
