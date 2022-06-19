import { ClaimData } from "../types/claim";
import moment from "moment";

export const check18Plus = (
  claim: ClaimData,
  now: Date = new Date()
): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const age = moment(claim.value.dob, "DD/MM/YYYY");
    const years = moment(now).diff(age, "years");
    return years >= 18;
  }
  return false;
};
