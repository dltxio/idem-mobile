import { expect } from "chai";
import { getVendor } from "../src/utils/vendor";

describe("Partners", () => {
  it("should get partner from id", () => {
    expect(getVendor(1)).to.equal("GPIB");
  });
});
