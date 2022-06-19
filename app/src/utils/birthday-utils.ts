import { ClaimData } from "../types/claim";
import moment from "moment";
import { reformatDate } from "./formatter";

export const check18Plus = (claim: ClaimData): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const userBirthday = reformatDate(claim.value.dob);
    const age = moment(userBirthday, "YYYYMMDD").fromNow();
    const userAge = age.split("").slice(0, 2).join("");
    if (age.includes("in")) {
      return false;
    }
    if (Number(userAge) >= 18) {
      return true;
    }
  }
  return false;
};
