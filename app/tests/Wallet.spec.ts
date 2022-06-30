import { expect } from "chai";
import { truncateAddress } from "../src/utils/wallet-utils";

describe("Wallet utils", async () => {
  it("should truncate an ETH address", () => {
    expect(truncateAddress("29/04/2000")).to.equal("2000");
  });
});