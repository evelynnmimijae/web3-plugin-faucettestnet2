import { Web3 } from "web3";
import { FaucetPlugin } from "../src";
import crypto from 'crypto';

jest.mock('web3', () => {
  const originalModule = jest.requireActual('web3');

  return {
    __esModule: true,
   ...originalModule,
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
          sendSignedTransaction: jest.fn(), // Simplified for demonstration
        },
      },
      utils: {
        toWei: jest.fn().mockReturnValue('1000000000000000000'),
      },
    })),
  };
});

describe("FaucetPlugin Tests", () => {
  let web3: Web3;
  let faucetPlugin: FaucetPlugin;

  beforeEach(() => {
    web3 = new Web3("http://127.0.0.1:8545");
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
    const transaction = await faucetPlugin.requestEther(address, amount);
    const generateMockPrivateKey = (): string => '0x' + crypto.randomBytes(32).toString('hex');
    const mockPrivateKey = generateMockPrivateKey();

    // Simulate signing the transaction externally
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, mockPrivateKey);

    // Verify the signed transaction structure
    expect(signedTransaction.transactionHash).toBe('0xMockedTxHash');
    expect(signedTransaction).toHaveProperty('rawTransaction');

    // Assert that sendSignedTransaction is called with the correct raw transaction
    expect(web3.eth.sendSignedTransaction).toHaveBeenCalledWith(signedTransaction.rawTransaction);
  });
});