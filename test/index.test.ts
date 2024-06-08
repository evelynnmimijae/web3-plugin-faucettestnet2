import { Web3, core } from "web3";
import { TemplatePlugin, FaucetPlugin } from "../src";

jest.mock('web3', () => ({
  Web3: jest.fn().mockImplementation(() => ({
    eth: {
      getAccounts: jest.fn().mockResolvedValue(['0xMockedAccount']),
      sendTransaction: jest.fn().mockResolvedValue({ transactionHash: '0xMockedTxHash' }),
    },
    utils: {
      toWei: jest.fn().mockReturnValue('1000000000000000000'), // Mock conversion to wei
    },
  })),
}));

describe("TemplatePlugin Tests", () => {
  it("should register TemplatePlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(new TemplatePlugin());
    expect(web3Context.template).toBeDefined();
  });

  describe("TemplatePlugin method tests", () => {
    let consoleSpy: jest.SpiedFunction<typeof global.console.log>;

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:8545");
      web3.registerPlugin(new TemplatePlugin());
      consoleSpy = jest.spyOn(global.console, "log").mockImplementation();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it("should call TempltyPlugin test method with expected param", () => {
      web3.template.test("test-param");
      expect(consoleSpy).toHaveBeenCalledWith("test-param");
    });
  });
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

  it("should request ether successfully", async () => {
    const address = '0xMockedAddress';
    const amount = 1;
    const receipt = await faucetPlugin.requestEther(address, amount);

    expect(receipt.transactionHash).toBe('0xMockedTxHash');
    expect(web3.eth.getAccounts).toHaveBeenCalled();
    expect(web3.eth.sendTransaction).toHaveBeenCalledWith(expect.objectContaining({
      to: address,
      value: '1000000000000000000',
      gas: 21000,
      from: '0xMockedAccount'
    }));
  });
});
