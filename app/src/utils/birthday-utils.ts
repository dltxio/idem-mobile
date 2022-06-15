import { ClaimData } from "../types/claim";
import { stringToDate } from "./formatter";

export const check18Plus = (claim: ClaimData): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const userBirthday = claim.value;
    const dateBirthday = stringToDate(userBirthday.dob);
    const today = Date.now();
    const eightteenYearsAgo = today - 568025136000;
    if (dateBirthday <= eightteenYearsAgo) {
      return true;
    }
  }
  return false;
};
