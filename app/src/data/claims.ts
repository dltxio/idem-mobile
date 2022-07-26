import { Claim } from "../types/claim";
const claims: Claim[] = [
  {
    type: "AdultCredential",
    key: "0x00",
    mnemonic: "eighteenplus",
    title: "18+",
    verified: false,
    description: "18 Plus",
    verificationAction: "document-upload",
    fields: [
      {
        id: "over18",
        title: "I am over 18",
        type: "boolean"
      }
    ],
    verificationDocuments: ["drivers-licence"]
  },
  {
    type: "BirthCredential",
    key: "0x01",
    mnemonic: "dob",
    verified: false,
    title: "Date Of Birth",
    description: "Users date of birth",
    verificationAction: "document-upload",
    fields: [
      {
        id: "dob",
        title: "Date Of Birth",
        type: "date"
      }
    ],
    verificationDocuments: ["drivers-licence", "passport", "birth-certificate"]
  },
  {
    type: "NameCredential",
    key: "0x02",
    mnemonic: "fullname",
    title: "Full Name",
    verified: false,
    description: "Users full name",
    verificationAction: "document-upload",
    fields: [
      { id: "firstName", title: "First name", type: "text" },
      { id: "lastName", title: "Last name", type: "text" }
    ],
    verificationDocuments: [
      "drivers-licence",
      "passport",
      "birth-certificate",
      "bank-statement",
      "rates-notice",
      "medicare-card"
    ]
  },
  {
    type: "EmailCredential",
    key: "0x03",
    mnemonic: "email",
    title: "Email",
    description: "Users email address",
    verificationAction: "action",
    fields: [{ id: "email", title: "Email", type: "email" }],
    verified: false,
    verificationDocuments: []
  },
  {
    type: "MobileCredential",
    key: "0x04",
    mnemonic: "mobilenumber",
    title: "Mobile",
    verified: false,
    description: "Users mobile number",
    verificationAction: "action",
    fields: [{ id: "mobileNumber", title: "Mobile number", type: "phone" }],
    verificationDocuments: []
  },
  {
    type: "AddressCredential",
    key: "0x05",
    mnemonic: "address",
    title: "Address",
    verified: false,
    description: "Users physical address",
    verificationAction: "document-upload",
    fields: [
      { id: "houseNumber", title: "House Number", type: "house" },
      { id: "street", title: "Street", type: "text" },
      { id: "suburb", title: "Suburb", type: "text" },
      { id: "postCode", title: "Post Code", type: "number" },
      { id: "state", title: "State", type: "text" },
      { id: "country", title: "Country", type: "text" }
    ],
    verificationDocuments: [
      "drivers-licence",
      "passport",
      "bank-statement",
      "rates-notice",
      "utility-account"
    ]
  },
  {
    type: "TaxCredential",
    key: "0x06",
    mnemonic: "taxnumber",
    title: "Tax File Number",
    verified: false,
    description: "Users tax file number",
    verificationAction: "action",
    fields: [{ id: "taxFileNumber", title: "Tax File Number", type: "number" }],
    verificationDocuments: []
  },
  {
    type: "ProfileImageCredential",
    key: "0x07",
    mnemonic: "profileImage",
    verified: false,
    title: "Profile image",
    description: "Your profile image",
    verificationAction: "action",
    fields: [],
    verificationDocuments: [],
    hideFromList: true
  }
];

export default claims;
