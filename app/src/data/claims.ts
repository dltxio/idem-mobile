import { Claim } from "../types/claim";
const claims: Claim[] = [
  {
    type: "18+",
    key: "0x00",
    nnemonic: "eighteen",
    title: "18+",
    description: "Older than 18",
    verificationAction: "document-upload",
    fields: [
      {
        id: "over18",
        title: "I am over 18",
        type: "boolean"
      }
    ],
    verificationDocuments: ["passport", "drivers-license"]
  },
  {
    type: "DateOfBirthCredential",
    key: "0x01",
    nnemonic: "dateofbirth",
    title: "Date Of Birth",
    description: "Your date of birth",
    verificationAction: "document-upload",
    fields: [
      {
        id: "dob",
        title: "Date Of Birth",
        type: "date"
      }
    ],
    verificationDocuments: ["passport", "drivers-license"]
  },
  {
    type: "FullNameCredential",
    key: "0x02",
    nnemonic: "fullname",
    title: "Full Name",
    description: "Your full name",
    verificationAction: "document-upload",
    fields: [
      { id: "firstName", title: "First name", type: "text" },
      { id: "lastName", title: "Last name", type: "text" }
    ],
    verificationDocuments: ["passport", "drivers-license"]
  },
  {
    type: "EmailCredential",
    key: "0x03",
    nnemonic: "email",
    title: "Email",
    description: "Your email address",
    verificationAction: "action",
    fields: [{ id: "email", title: "Email", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "MobileNumberCredential",
    key: "0x04",
    nnemonic: "mobile",
    title: "Mobile",
    description: "Your mobile number",
    verificationAction: "action",
    fields: [{ id: "mobileNumber", title: "Mobile number", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "AddressCredential",
    key: "0x05",
    nnemonic: "address",
    title: "Address",
    description: "Your home address",
    verificationAction: "document-upload",
    fields: [
      { id: "houseNumber", title: "House Number", type: "text" },
      { id: "street", title: "Street", type: "text" },
      { id: "suburb", title: "Suburb", type: "text" },
      { id: "postCode", title: "Post Code", type: "text" },
      { id: "state", title: "State", type: "text" },
      { id: "country", title: "Country", type: "text" }
    ],
    verificationDocuments: ["drivers-license"]
  },
  {
    type: "ProfileImageCredential",
    key: "0x06",
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
