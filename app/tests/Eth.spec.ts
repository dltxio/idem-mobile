import { expect } from "chai";
import { createMnemonic } from "../src/utils/eth-utils";

describe("Eth-Utils", () => {
  it("should create a 12 word", async () => {
    const actual = await createMnemonic();
    const seed: string[] = actual.mnemonicPhrase.split(" ");
    expect(seed).to.be.of.length(12);
    expect(actual.ethAddress).not.to.be.null;
  });
});
