import { ClaimData } from "../types/claim";
import moment from "moment";

export const check18Plus = (claim: ClaimData): boolean => {
  const age = moment(Date.now()).diff(
    moment(claim.value.dob, "DD/MM/YYYY"),
    "years"
  );
  return age >= 18;
};
