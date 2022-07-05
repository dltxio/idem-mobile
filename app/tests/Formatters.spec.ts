import { expect } from "chai";
import { findYOB, findNames } from "../src/utils/formatters";

describe("Year Of Birth formatters", () => {
  it("should return the year", () => {
    expect(findYOB("29/04/2000")).to.equal("2000");
  });
});

describe("Name formatters", () => {
  it("should find names", () => {
    const actual = findNames("Satoshi Nakamoto");
    expect(actual?.firstName).to.be.eq("Satoshi");
    expect(actual?.lastName).to.be.eq("Nakamoto");
  });
});
