import { expect } from "chai";
import { genPGPG } from "../src/utils/pgp-utils";

describe("PGP Tests", () => {
  it("should generate a new PGP Key Pair", async () => {
    const actual = 
    expect(await genPGPG("my passsword")).to.equal(true);
  });
});
