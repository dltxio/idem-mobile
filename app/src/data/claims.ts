import { ClaimTypeConstants, DocumentTypeConstants } from "../constants/common";
import { Claim } from "../types/claim";

const claims: Claim[] = [
  {
    type: ClaimTypeConstants.EmailCredential,
    key: "0x03",
    mnemonic: "email",
    title: "Email",
    description: "Users email address",
    verificationAction: "action",
    fields: [{ id: "email", title: "Email", type: "email" }],
    verificationDocuments: []
  },
  {
    type: ClaimTypeConstants.MobileCredential,
    key: "0x04",
    mnemonic: "mobilenumber",
    title: "Mobile",
    description: "Users mobile number",
    verificationAction: "otp",
    fields: [{ id: "mobileNumber", title: "Mobile Number", type: "phone" }],
    verificationDocuments: []
  },
  {
    type: ClaimTypeConstants.NameCredential,
    key: "0x02",
    mnemonic: "fullname",
    title: "Full Name",
    description: "Users full name",
    verificationAction: "document-upload",
    fields: [
      { id: "firstName", title: "First Name", type: "text" },
      { id: "middleName", title: "Middle Name", type: "text" },
      { id: "lastName", title: "Last Name", type: "text" }
    ],
    verificationDocuments: [
      DocumentTypeConstants.LicenceDocument,
      DocumentTypeConstants.MedicareDocument
    ]
  },
  {
    type: ClaimTypeConstants.AddressCredential,
    key: "0x05",
    mnemonic: "address",
    title: "Address",
    description: "Users physical address",
    verificationAction: "document-upload",
    fields: [
      { id: "houseNumber", title: "House Number", type: "house" },
      { id: "street", title: "Street", type: "text" },
      { id: "streetType", title: "Street Type", type: "text" },
      { id: "suburb", title: "Suburb", type: "text" },
      { id: "postCode", title: "Post Code", type: "number" },
      { id: "state", title: "State", type: "text" },
      { id: "country", title: "Country", type: "text" }
    ],
    verificationDocuments: [DocumentTypeConstants.LicenceDocument]
  },
  {
    type: ClaimTypeConstants.BirthCredential,
    key: "0x01",
    mnemonic: "dob",
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
    verificationDocuments: [DocumentTypeConstants.LicenceDocument]
  },
  {
    type: ClaimTypeConstants.AdultCredential,
    key: "0x00",
    mnemonic: "eighteenplus",
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
    verificationDocuments: [DocumentTypeConstants.LicenceDocument]
  },
  // {
  //   type: "TaxCredential",
  //   key: "0x06",
  //   mnemonic: "taxnumber",
  //   title: "Tax File Number",
  //   description: "Users tax file number",
  //   verificationAction: "action",
  //   fields: [{ id: "taxFileNumber", title: "Tax File Number", type: "number" }],
  //   verificationDocuments: [],
  //   hideFromList: true
  // },
  {
    type: ClaimTypeConstants.ProfileImageCredential,
    key: "0x07",
    mnemonic: "profileImage",
    title: "Profile image",
    description: "Your profile image",
    verificationAction: "action",
    fields: [],
    verificationDocuments: [],
    hideFromList: true
  }
];

export default claims;
