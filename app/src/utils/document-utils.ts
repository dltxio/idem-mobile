import { ClaimTypeConstants, DocumentTypeConstants } from "../constants/common";
import allDocuments from "../data/documents";
import { DOB, Document, LicenceData, MedicareData } from "../types/document";

export const getDocumentFromDocumentType = (
  documentType: DocumentTypeConstants
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
    // Could we not use id here?
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

// Couldnt these be a generic Type?
export const getMedicareValuesAsObject = (
  document: Document | undefined
): MedicareData => {
  if (!document || document.type !== "medicare-card") {
    throw new Error("This is not a drivers licence");
  }

  const fields: MedicareData = {
    colour: "Green",
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
        fields.colour = (field.value as "Green" | "Blue" | "Yellow") ?? "Green";
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
export const getClaimScreenByType = (claimType: ClaimTypeConstants) => {
  switch (claimType) {
    case ClaimTypeConstants.AddressCredential:
      return "AddressClaim";
    case ClaimTypeConstants.AdultCredential:
      return "AdultClaim";
    case ClaimTypeConstants.BirthCredential:
      return "BirthClaim";
    case ClaimTypeConstants.EmailCredential:
      return "EmailClaim";
    case ClaimTypeConstants.MobileCredential:
      return "MobileClaim";
    case ClaimTypeConstants.NameCredential:
      return "NameClaim";
    default:
      return "Home";
  }
};
