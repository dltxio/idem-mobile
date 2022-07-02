import { expect } from "chai";
import { truncateAddress } from "../src/utils/wallet-utils";

describe("Wallet utils", () => {
  it("should truncate an ETH address", () => {
    expect(truncateAddress("0xfa0B65413E3E81FAF7321f85b2AfdD0EffF13Ef5")).to.equal("0xfa0B65413E...dD0EffF13Ef5");
  });
});