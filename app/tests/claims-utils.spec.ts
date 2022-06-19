import { expect } from "chai";
import { ClaimWithValue } from "../src/types/claim";

import { displayClaimValue } from "../src/utils/claim-utils";

describe("Claims Utils", async () => {
  it("should display claims", () => {

    let claimWithValue: ClaimWithValue; // = new ClaimWithValue(); // { type: "DateOfBirthCredential", value: { dob: "01/01/2000" } };
    // claimWithValue.type = "DateOfBirthCredential";

    expect(displayClaimValue(claimWithValue)).to.equal(2004);
  });
});
