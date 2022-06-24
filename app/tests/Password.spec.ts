import { expect } from "chai";
import { createRandomPassword } from "../src/context/Exchange";

describe("This is a unit test", async () => {
  it("It should not generate the same password twice", () => {
    const firstPassword = createRandomPassword();
    const secondPassword = createRandomPassword();
    expect(firstPassword).to.not.equal(secondPassword);
  });
});
