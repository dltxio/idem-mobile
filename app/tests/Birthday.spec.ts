import { expect } from "chai";
import { Birthday } from "../src/claims/birthday";
import { check18Plus } from "../src/utils/birthday-utils";

describe("Check if I'm 18", () => {
  it("should return true if I am 18", () => {
    expect(
      check18Plus({
        type: "BirthCredential",
        value: { dob: "14/06/2004" },
        verified: false
      })
    ).to.equal(true);
  });

  it("should return true if I am 69", () => {
    expect(
      check18Plus({
        type: "BirthCredential",
        value: { dob: "14/06/1953" },
        verified: false
      })
    ).to.equal(true);
  });

  it("should return false if I am 4", () => {
    expect(
      check18Plus({
        type: "BirthCredential",
        value: { dob: "14/06/2016" },
        verified: false
      })
    ).to.equal(false);
  });

  it("should return false if I am -1000", () => {
    expect(
      check18Plus({
        type: "BirthCredential",
        value: { dob: "14/06/3022" },
        verified: false
      })
    ).to.equal(false);
  });

  it("should return false if I am entering a not birthday claim", () => {
    expect(
      check18Plus({
        type: "EmailCredential",
        value: "jo@yourmom.com",
        verified: false
      })
    ).to.equal(false);
  });

  it("should create birthday claim object", () => {
    const claim = new Birthday();
    expect(claim.description).to.equal("Users date of birth");
  });
});
