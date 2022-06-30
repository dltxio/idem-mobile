import { ClaimData } from "../types/claim";
import moment from "moment";


export const check18Plus = (claim: ClaimData): boolean => {
  if (claim.type === "DateOfBirthCredential") {
    const age = moment(Date.now()).diff(
      moment(claim.value.dob, "DD/MM/YYYY"),
      "years"
    );
    if (age >= 18) {
      return true;
    }
    return false;
  }
  return false;
};
