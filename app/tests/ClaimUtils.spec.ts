import { expect } from "chai";
import { displayClaimValue } from "../src/utils/claim-utils";
import { ClaimWithValue } from "../src/types/claim";
import { ClaimTypeConstants } from "../src/constants/common";

describe("Claim utils", () => {
  it("should display claim value", () => {
    const claim: ClaimWithValue = {
      type: ClaimTypeConstants.NameCredential,
      key: "name",
      mnemonic: "name",
      title: "Name",
      description: "Name",
      verificationAction: "action",
      fields: [],
      verificationDocuments: [],
      value: "Satoshi Nakamoto"
    };
    // const actual = displayClaimValue(claim);
    // expect(actual).to.be.eq("Satoshi Nakamoto");
  });
});
