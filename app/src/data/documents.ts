import { DocumentTypeConstants } from "../constants/common";
import { Document } from "../types/document";

const documents: Document[] = [
  {
    type: DocumentTypeConstants.LicenceDocument,
    title: "Driver Licence",
    fields: [
      {
        title: "State",
        type: "dropdown",
        valueOptions: ["QLD", "NSW", "VIC", "SA", "WA", "TAS", "NT", "ACT"]
      },
      {
        title: "Licence Number",
        type: "number"
      },
      {
        title: "Card Number",
        type: "string"
      },
      {
        title: "First Name",
        type: "string"
      },
      {
        title: "Middle Name",
        type: "string",
        optional: true
      },
      {
        title: "Last Name",
        type: "string"
      },
      {
        title: "Date Of Birth",
        type: "date"
      }
    ]
  },
  // {
  //   type: "birth-certificate",
  //   title: "Birth Certificate"
  // },
  // {
  //   type: "bank-statement",
  //   title: "Bank Statement"
  // },
  // {
  //   type: "rates-notice",
  //   title: "Rates Notice"
  // },
  // {
  //   type: "utility-account",
  //   title: "Utility Account"
  // },
  {
    type: DocumentTypeConstants.MedicareDocument,
    title: "Medicare Card",
    fields: [
      {
        title: "Card Type",
        type: "dropdown",
        valueOptions: ["Green", "Blue", "Yellow"]
      },
      {
        title: "Medicare Card Number",
        type: "number"
      },
      {
        title: "Individual Reference Number",
        type: "number"
      },
      {
        title: "Name on Card",
        type: "string"
      },
      {
        title: "Valid To",
        type: "string"
      }
    ]
  },
  {
    type: DocumentTypeConstants.PassportDocument,
    title: "Passport",
    fields: [
      {
        title: "Issue Date",
        type: "date"
      },
      {
        title: "Expiry Date",
        type: "date"
      },
      {
        title: "Document Number",
        type: "string"
      }
    ]
  }
];

export default documents;
