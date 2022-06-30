import { Claim } from "../types/claim";
const claims: Claim[] = [
  {
    type: "AdultCredential",
    key: "0x00",
    nnemonic: "eighteenplus",
    title: "18+",
    description: "18 Plus",
    verificationAction: "document-upload",
    fields: [
      {
        id: "over18",
        title: "I am over 18",
        type: "boolean"
      }
    ],
    verificationDocuments: ["drivers-license"]
  },
  {
    type: "BirthCredential",
    key: "0x01",
    nnemonic: "dob",
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
    verificationDocuments: ["drivers-license", "passport", "birth-certificate"]
  },
  {
    type: "NameCredential",
    key: "0x02",
    nnemonic: "fullname",
    title: "Full Name",
    description: "Users full name",
    verificationAction: "document-upload",
    fields: [
      { id: "firstName", title: "First name", type: "text" },
      { id: "lastName", title: "Last name", type: "text" }
    ],
    verificationDocuments: [
      "drivers-license",
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
    nnemonic: "email",
    title: "Email",
    description: "Users email address",
    verificationAction: "action",
    fields: [{ id: "email", title: "Email", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "MobileCredential",
    key: "0x04",
    nnemonic: "mobilenumber",
    title: "Mobile",
    description: "Users mobile number",
    verificationAction: "action",
    fields: [{ id: "mobileNumber", title: "Mobile number", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "AddressCredential",
    key: "0x05",
    nnemonic: "address",
    title: "Address",
    description: "Users physical address",
    verificationAction: "document-upload",
    fields: [
      { id: "houseNumber", title: "House Number", type: "text" },
      { id: "street", title: "Street", type: "text" },
      { id: "suburb", title: "Suburb", type: "text" },
      { id: "postCode", title: "Post Code", type: "text" },
      { id: "state", title: "State", type: "text" },
      { id: "country", title: "Country", type: "text" }
    ],
    verificationDocuments: [
      "drivers-license",
      "passport",
      "bank-statement",
      "rates-notice",
      "utility-account"
    ]
  },
  {
    type: "TaxCredential",
    key: "0x06",
    nnemonic: "taxnumber",
    title: "Tax Number",
    description: "Users tax file number",
    verificationAction: "action",
    fields: [{ id: "taxFileNumber", title: "Tax File Number", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "ProfileImageCredential",
    key: "0x07",
    nnemonic: "profileImage",
    title: "Profile image",
    description: "Your profile image",
    verificationAction: "action",
    fields: [],
    verificationDocuments: [],
    hideFromList: true
  }
];

export default claims;
