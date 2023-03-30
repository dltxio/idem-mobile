import { DocumentTypeConstants } from "../constants/common";
import { Document } from "../types/document";

const documents: Document[] = [
  // {
  //   type: "passport",
  //   title: "Passport",
  //   fields: [
  //     {
  //       title: "Passport Number",
  //       type: "number"
  //     },
  //     {
  //       title: "First Name",
  //       type: "string"
  //     },
  //     {
  //       title: "Middle Name",
  //       type: "string",
  //       optional: true
  //     },
  //     {
  //       title: "Last Name",
  //       type: "string"
  //     },
  //     {
  //       title: "Date Of Birth",
  //       type: "date"
  //     }
  //   ]
  // },
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
        type: "text"
      },
      {
        title: "First Name",
        type: "text"
      },
      {
        title: "Middle Name",
        type: "text",
        optional: true
      },
      {
        title: "Last Name",
        type: "text"
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
        valueOptions: ["green", "yellow", "blue"]
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
        title: "Full Name",
        type: "text"
      },
      {
        title: "Card Expiry Date",
        type: "text"
      },
      {
        title: "Date Of Birth",
        type: "date"
      }
    ]
  }
];

export default documents;
