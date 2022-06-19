import { expect } from "chai";

import { findYOB } from "../src/utils/formatters";

describe("Formatters", async () => {
  it("should find YOB", () => {
    expect(findYOB("14/06/2004")).to.equal(2004);
  });
});
