import { expect } from "chai";
import { MnemonicProvider } from "../src/context/Mnemonic";
import { createMnemonic } from "../src/utils/eth-utils";

// describe("Mnemonic Context", async () => {
//   it("should create a 12 word", () => {
//     const provider = MnemonicProvider;
//     const actual = provider.
//     expect(firstPassword).to.not.equal(secondPassword);
//   });
// });

describe("Mnemonic Context", () => {
  it("should create a 12 word", async () => {
    const provider = MnemonicProvider;
    const actual = await createMnemonic();
    expect(firstPassword).to.not.equal(secondPassword);
  });
});