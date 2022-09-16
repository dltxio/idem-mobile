import { ClaimTypeConstants } from "../constants/common";
import { useDocumentStore } from "../context/DocumentStore";
import { useClaimValue } from "../context/ClaimsStore";
import { findNames } from "./formatters";
import documents from "../data/documents";
  const dob = useClaimValue(ClaimTypeConstants.BirthCredential);
  const name = useClaimValue(ClaimTypeConstants.NameCredential);

const splitName = findNames(name);

const medicareCard = documents.filter(
    (document) => document.type === "medicare-card"
  );
const driversLicence = documents.filter(
    (document) => document.type === "drivers-licence"
  );
const user = 

const splitDob = dob.split("-");

const verifyUserOnProxy = () => {

            user: {
              ruleId: "default",
              name: {
                givenName: "string",
                middleNames?: "string",
                surname: "string",
              },
              dob: {
                day: day,
                month: "",
                year: "number",
              }
        
  };
  licence?: {
    state: "QLD" | "NSW" | "ACT" | "VIC" | "NT" | "SA" | "WA" | "TAS";
    licenceNumber: string;
    cardNumber: string;
    name: {
      givenName: string;
      middleNames?: string;
      surname: string;
    };
    dob: {
      day: number;
      month: number;
      year: number;
    };
  };
  medicare?: {
    colour: "Green" | "Blue" | "Yellow";
    number: string;
    individualReferenceNumber: string;
    name: string;
    dob: string;
    expiry: string;
    name2?: string;
    name3?: string;
    name4?: string;
  
      } 
};
export default verifyUserOnProxy;