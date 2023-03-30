import { expect } from "chai";
import { DocumentTypeConstants } from "../src/constants/common";
import { Document } from "../src/types/document";
import {
  getDocumentFromDocumentType,
  getImageFileName,
  getLicenceValuesAsObject,
  splitDob
} from "../src/utils/document-utils";

describe("Document-Utils", () => {
  it("should get file name", () => {
    const actual = getImageFileName("test.png");
    expect(actual).to.be.eq("test.png");
  });

  it.skip("should get document from document type", () => {
    const actual = getDocumentFromDocumentType(
      DocumentTypeConstants.LicenceDocument
    );
    expect(actual).to.be.eq("drivers-licence");
  });

  it("should get drivers", () => {
    const mock: Document = {
      id: "1",
      type: DocumentTypeConstants.LicenceDocument,
      title: "Drivers Licence",
      fields: [
        {
          title: "Licence Number",
          type: "string",
          value: "123456789",
          optional: false
        },
        {
          title: "Card Number",
          type: "string",
          value: "abcdefghi",
          optional: false
        },
        {
          title: "First Name",
          type: "string",
          value: "John",
          optional: false
        },
        {
          title: "Middle Name",
          type: "string",
          value: "James",
          optional: true
        },
        {
          title: "Last Name",
          type: "string",
          value: "Smith",
          optional: false
        }
      ],
      fileIds: ["123456789"]
    };

    const actual = getLicenceValuesAsObject(mock);
    expect(actual.licenceNumber).to.be.eq("123456789");
  });

  it("should split dob", () => {
    const actual = splitDob("29/04/2000");
    expect(actual?.day).to.be.eq(29);
    expect(actual?.month).to.be.eq(4);
    expect(actual?.year).to.be.eq(2000);
  });
});
