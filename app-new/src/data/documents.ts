import { Document, DocumentField } from "../types/document";

const fullNameField: DocumentField = {
  id: "fullName",
  title: "Full Name",
  type: "text",
  claimTypes: ["FullNameCredential"]
};

const dobField: DocumentField = {
  id: "dob",
  title: "Date of birth",
  type: "date",
  claimTypes: ["DateOfBirthCredential", "18+"]
};

const claims: Document[] = [
  {
    id: "passport",
    title: "Passport",
    fields: [fullNameField, dobField]
  },
  {
    id: "driversLicense",
    title: "Driver's License",
    fields: [
      fullNameField,
      dobField,
      {
        id: "address",
        title: "Address",
        type: "text",
        claimTypes: ["AddressCredential"]
      }
    ]
  }
];

export default claims;
