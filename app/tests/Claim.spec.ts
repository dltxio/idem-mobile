import { expect } from "chai";
import { ClaimTypeConstants } from "../src/constants/common";
import { getClaimScreenByType } from "../src/utils/document-utils";

describe("Claims", () => {
  it("should get claim screen by type", () => {
    const actual = getClaimScreenByType(ClaimTypeConstants.AdultCredential);
    expect(actual).to.be.eq("AdultClaim");
  });
});
