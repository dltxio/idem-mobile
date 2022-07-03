import { expect } from "chai";
import { createPublicKey, generatePGPG } from "../src/utils/pgp-utils";

describe("PGP Tests", () => {
  it("should generate a new PGP Key Pair", async () => {
    const actual = await generatePGPG(
      "my passsword",
      "Sathoshi",
      "satoshin@gmx.com"
    );

    expect(actual.privateKey).not.to.be.null;
    expect(actual.publicKey).not.to.be.null;
  });

  it("should create a PGP Key Pair from PGP Private Key", async () => {
    const privateKey = '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
    '\n' +
    'xYYEYsEbCxYJKwYBBAHaRw8BAQdAZYevzGVFGKDVFEeDh52k3CZkRuennyhG\n' +
    'uvdzvymUl6b+CQMIBRkUZgExtHHgrLGuMteFSf4wiPz8HcDPHbn/CmIFzFKU\n' +
    'Udiu+pwWY8fsYb1Nt/zwACT2wG+msMZ/2rBG6+bbhmyo1ytHdCJ26sgnssJb\n' +
    'Os0bU2F0aG9zaGkgPHNhdG9zaGluQGdteC5jb20+wowEEBYKAB0FAmLBGwsE\n' +
    'CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRAP2fMtqTCsQhYhBJ/DuhI1SRds\n' +
    'rQXV8w/Z8y2pMKxC0z4BANN3Hh51b+AykhCKPCmVK1opcopWXIhsMQRzil9s\n' +
    '4wOHAPwPPLPvsXm8Xjzcz1Z3feVZs3Gm30i/jRH0esYW3qcbCseLBGLBGwsS\n' +
    'CisGAQQBl1UBBQEBB0D7GEtoOFugWz1QFcG6HLnaze0qBah6JbuYXVHWGXta\n' +
    'NAMBCAf+CQMIeOWxH4zaEgHgs4O9TXIBbD6SNQz1J6d+P7Vxn/z8MzeiDRVD\n' +
    'Z7RzTecpNnZziIApin7u2l0dOITMM9K179if2BxIBME0zt2I5k4iing2bMJ4\n' +
    'BBgWCAAJBQJiwRsLAhsMACEJEA/Z8y2pMKxCFiEEn8O6EjVJF2ytBdXzD9nz\n' +
    'LakwrEI/cgEAnfp3exhmTXHJE8XIEyqPH4kAVUiaJev7ves2Td5q1mMA/Rt7\n' +
    'g/YWH0Iv8lsg9d1q5WAc0u0DQvQK/Zrr/5CAfbwJ\n' +
    '=fmLW\n' +
    '-----END PGP PRIVATE KEY BLOCK-----\n'

    const actual = await createPublicKey(privateKey);
    
    expect(actual.privateKey).not.to.be.null;
    expect(actual.publicKey).not.to.be.null;
  });
});
