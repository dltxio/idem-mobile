import { ClaimData } from "../types/claim";
import moment from "moment";
import { reformatDate } from "./formatters";

export const check18Plus = (claim: ClaimData): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const birthday = reformatDate(claim.value.dob);
    const age = moment(birthday, "YYYYMMDD").fromNow();
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
