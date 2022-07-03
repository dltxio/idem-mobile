import { expect } from "chai";
import { genPGPG } from "../src/utils/pgp-utils";

describe("PGP Tests", () => {
  it("should generate a new PGP Key Pair", async () => {
    expect(await genPGPG()).to.equal(true);
  });
});
