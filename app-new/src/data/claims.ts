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
        title: "Date of birth",
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
    verificationAction: "form",
    fields: [{ id: "email", title: "email", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "MobileNumberCredential",
    key: "0x04",
    nnemonic: "mobile",
    title: "Mobile",
    description: "Your mobile number",
    verificationAction: "form",
    fields: [{ id: "mobileNumber", title: "Mobile number", type: "text" }],
    verificationDocuments: []
  },
  {
    type: "AddressCredential",
    key: "0x05",
    nnemonic: "address",
    title: "Address",
    description: "Your physical address",
    verificationAction: "document-upload",
    fields: [
      { id: "propertyNumber", title: "Property Number", type: "text" },
      { id: "streetName", title: "Street Name", type: "text" },
      { id: "postCode", title: "Post Code", type: "text" }
    ],
    verificationDocuments: ["drivers-license"]
  }
];

export default claims;
