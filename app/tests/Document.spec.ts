import { expect } from "chai";
import { getImageFileName } from "../src/utils/document-utils";

it("should get file name", () => {
  const actual = getImageFileName("test.png");
  expect(actual).to.be.eq("test.png");
});
