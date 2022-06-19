import { expect } from "chai";

import { findYOB, findNames } from "../src/utils/formatters";

describe("Formatters", async () => {
  it("should find YOB", () => {
    expect(findYOB("14/06/2004")).to.equal(2004);
  });

  it("should find full name", () => {
    const actual = findNames("satoshi nakamoto");
    expect(actual?.firstName).to.equal("satoshi");
    expect(actual?.lastName).to.equal("nakamoto");
  });
});
