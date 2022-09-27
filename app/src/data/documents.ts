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
    type: "drivers-licence",
    title: "Driver Licence",
    fields: [
      {
        title: "License Number",
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
    type: "medicare-card",
    title: "Medicare Card",
    fields: [
      {
        title: "Card Type",
        type: "string",
        valueOptions: ["Green", "Yellow", "Blue"]
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
        type: "string"
      },
      {
        title: "Card Expiry Date",
        type: "string"
      },
      {
        title: "Date Of Birth",
        type: "date"
      }
    ]
  }
];

export default documents;
