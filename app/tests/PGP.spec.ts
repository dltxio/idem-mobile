import { expect } from "chai";
import { createPublicKey, generatePGPG } from "../src/utils/pgp-utils";

describe("PGP Tests", () => {
  it("should generate a new PGP Key Pair", async () => {
    const actual = await generatePGPG(
      "my passsword",
      "Sathoshi",
      "satoshin@gmx.com"
    );

    console.log(actual.privateKey);

    expect(actual.privateKey).not.to.be.null;
    expect(actual.publicKey).not.to.be.null;
  });

  it("should create a PGP Key Pair from PGP Private Key", async () => {
    const privateKey = `
    -----BEGIN PGP PRIVATE KEY BLOCK-----
    
    xYYEYsEI7RYJKwYBBAHaRw8BAQdA/65uruofe2o8DjorDR6EleVtoLqjjG3+
    NYzMMqTwcPP+CQMIkoooMFdrfA/gcg6BSeeIxuUEwoo1eSqVu0Nx3iiTx8cP
    mywp77TBxJeqZPrAIng0nhI3W+1whRnOVy509yf0iZrJnyT0IY1cktn8cOKC
    2M0bU2F0aG9zaGkgPHNhdG9zaGluQGdteC5jb20+wowEEBYKAB0FAmLBCO0E
    CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRAmPmXc5bDL9BYhBLVpM4ZTW6e3
    h9qCKSY+ZdzlsMv09l4BAIh0wo2RgUuDHH5LaQKEEwnFCZ0s/HmN36BtyMFx
    UthlAP4wy6Kd5JzLU56l2Bls3WFQgsTAmdGI346rQG6hYuWRA8eLBGLBCO0S
    CisGAQQBl1UBBQEBB0A1VSWGgx6hCTNz4epzswmmItHNQTRErx96XLURW0xI
    BAMBCAf+CQMIZ6wmzYyODxng20yiaKQV+tzJQsgKrEmQoamfnRUOnt8rp2SA
    LbQI1EsJf5hz4/5JJX6gH7uTZOWjC67IKAiMAsCtMIbRlaajg3c9PERHG8J4
    BBgWCAAJBQJiwQjtAhsMACEJECY+ZdzlsMv0FiEEtWkzhlNbp7eH2oIpJj5l
    3OWwy/QdGAD/SvMckOnplfZK/862Ma8ybyUvh/EZMI8O7pwNV+KBw7IA/3Gj
    EkpWYhdr86BJv5gw2JDrOEdhxurjv4R/9zaNIrIO
    =YBIH
    -----END PGP PRIVATE KEY BLOCK-----`;

    console.log(privateKey);
    const actual = await createPublicKey(privateKey);
    
    expect(actual.privateKey).not.to.be.null;
    expect(actual.publicKey).not.to.be.null;
  });
});
