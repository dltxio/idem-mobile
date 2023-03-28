import allDocuments from "../data/documents";
import { ClaimType } from "../types/claim";
import {
  DOB,
  Document,
  DocumentType,
  LicenceData,
  MedicareData
} from "../types/document";

export const getDocumentFromDocumentType = (
  documentType: DocumentType
): Document => {
  const document = allDocuments.find((doc) => doc.type === documentType);
  if (document) return document;
  throw Error("Document not found");
};

export const getImageFileName = (uri: string): string => {
  return uri.split("/").pop() as string;
};

export const getLicenceValuesAsObject = (
  document: Document | undefined
): LicenceData => {
  if (!document || document.type !== "drivers-licence") {
    throw new Error("This is not a drivers licence");
  }

  const fields: LicenceData = {
    licenceNumber: "",
    cardNumber: "",
    state: "QLD",
    name: {
      givenName: "",
      middleNames: "",
      surname: ""
    },
    dob: {
      day: 1,
      month: 1,
      year: 1900
    }
  };

  document.fields?.forEach((field) => {
    if (!field.optional && (!field.value || field.value === "")) {
      throw new Error("invalid drivers licence data");
    }
    switch (field.title) {
      case "Licence Number":
        fields.licenceNumber = field.value ?? "";
        break;
      case "Card Number":
        fields.cardNumber = field.value ?? "";
        break;
      case "First Name":
        fields.name.givenName = field.value ?? "";
        break;
      case "Middle Name":
        fields.name.middleNames = field.value ?? "";
        break;
      case "Last Name":
        fields.name.surname = field.value ?? "";
        break;
      case "Date Of Birth":
        fields.dob = splitDob(field.value);
        break;
    }
  });

  return fields;
};

export const getMedicareValuesAsObject = (
  document: Document | undefined
): MedicareData => {
  if (!document || document.type !== "medicare-card") {
    throw new Error("This is not a drivers licence");
  }

  const fields: MedicareData = {
    colour: "green",
    number: "",
    individualReferenceNumber: "",
    name: "",
    dob: {
      day: 1,
      month: 1,
      year: 1
    },
    expiry: ""
  };

  document.fields?.forEach((field) => {
    if (!field.optional && (!field.value || field.value === "")) {
      throw new Error("invalid medicare card data");
    }
    switch (field.title) {
      case "Card Type":
        fields.colour = (field.value as "green" | "blue" | "yellow") ?? "green";
        break;
      case "Medicare Card Number":
        fields.number = field.value ?? "";
        break;
      case "Individual Reference Number":
        fields.individualReferenceNumber = field.value ?? "";
        break;
      case "Full Name":
        fields.name = field.value ?? "";
        break;
      case "Card Expiry Date":
        fields.expiry = field.value ?? "";
        break;
      case "Date Of Birth":
        fields.dob = splitDob(field.value);
        break;
    }
  });

  return fields;
};

export const splitDob = (dob: string | undefined): DOB => {
  const _splitDob = dob?.split("/");
  if (!_splitDob || _splitDob.length !== 3) {
    throw new Error("Date of birth needs to be in the form dd/mm/yyyy");
  }

  try {
    const formatedDob = {
      day: parseInt(_splitDob[0]),
      month: parseInt(_splitDob[1]),
      year: parseInt(_splitDob[2])
    };

    return formatedDob;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Failed to parse Date of birth. Make sure it is in the form dd/mm/yyyy"
    );
  }
};

// TODO: REMOVE, PUT HERE TO UNIT TEST
export const getClaimScreenByType = (claimType: ClaimType) => {
  switch (claimType) {
    case "AddressCredential":
      return "AddressClaim";
    case "AdultCredential":
      return "AdultClaim";
    case "BirthCredential":
      return "BirthClaim";
    case "EmailCredential":
      return "EmailClaim";
    case "MobileCredential":
      return "MobileClaim";
    case "NameCredential":
      return "NameClaim";
    default:
      return "Home";
  }
};