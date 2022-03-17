import { Claim } from "../types/claim";

const claims: Claim[] = [
  {
    type: "18+",
    key: "0x00",
    nnemonic: "eighteen",
    title: "18+",
    description: "Older than 18",
    verificationAction: "document-upload"
  },
  {
    type: "DateOfBirthCredential",
    key: "0x01",
    nnemonic: "dateofbirth",
    title: "Date Of Birth",
    description: "Your date of birth",
    verificationAction: "document-upload"
  },
  {
    type: "FullNameCredential",
    key: "0x02",
    nnemonic: "fullname",
    title: "Full Name",
    description: "Your full name",
    verificationAction: "document-upload"
  },
  {
    type: "EmailCredential",
    key: "0x03",
    nnemonic: "email",
    title: "Email",
    description: "Your email address",
    verificationAction: "form"
  },
  {
    type: "MobileNumberCredential",
    key: "0x04",
    nnemonic: "mobile",
    title: "Mobile",
    description: "Your mobile number",
    verificationAction: "form"
  },
  {
    type: "AddressCredential",
    key: "0x05",
    nnemonic: "address",
    title: "Address",
    description: "Your physical address",
    verificationAction: "document-upload"
  }
];

export default claims;
