// web3Provider.ts
import Web3 from "web3";

export function provider() {
  return Web3.givenProvider;
}
