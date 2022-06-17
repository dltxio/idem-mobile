import { ClaimData } from "../types/claim";
import moment from "moment";
import { reformatDate } from "./formatter";

export const check18Plus = (claim: ClaimData): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const userBirthday = reformatDate(claim.value.dob);
    const age = moment(userBirthday).diff(moment(Date.now()));
    if (age <= 18) {
      return true;
    }
  }
  return false;
};
