import { expect } from "chai";
import { createRandomPassword } from "../src/utils/randomPassword-utils";

describe("Random passwords", () => {
  it("should not generate the same password twice", () => {
    const firstPassword = createRandomPassword();
    const secondPassword = createRandomPassword();
    expect(firstPassword).to.not.equal(secondPassword);
  });
});
