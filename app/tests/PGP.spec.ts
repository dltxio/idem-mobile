import { expect } from "chai";
import { genPGPG } from "../src/utils/pgp-utils";

describe("PGP Tests", () => {
  it("should generate a new PGP Key Pair", async () => {
    const actual = await genPGPG("my passsword", "Sathoshi", "satoshin@gmx.com");
    expect(actual.privateKey).not.to.be.null;
    expect(actual.publicKey).not.to.be.null;
  });
});
