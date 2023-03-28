import { expect } from "chai";
import { getPartner } from "../src/utils/partner";

describe("Partners", () => {
  it("should get partner from id", () => {
    expect(getPartner(1)).to.equal("GPIB");
  });
});
