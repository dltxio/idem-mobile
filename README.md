# IDEM Mobile

The React native mobile app for IDEM.

![build status main branch](https://github.com/dltxio/idem-mobile/workflows/CI/badge.svg?branch=main)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


## Introduction

IDEM facilitates users to register on a customer's website, such as a crypto exchange without having the user to manually enter onboarding information such as email, password and personal metadata which we call claims.

**Note: Data is securely stored on your device.  IDEM does not have a server!**


## Running the app

To run the application locally by using the expo dev-client

```bash
yarn install
cd app
yarn start

```

## What is IDEM?


IDEM (_IDEM_, from now on) is an open-source cross-platform mobile application based on the [Decentralised Identity Foundation's DID protocol](https://identity.foundation). The application gives individuals control of their digital identities by establishing trust in an interaction between two individuals or entities that do not know each other. For trust to happen, the offering party will present credentials to the receiving parties, which can verify that the credentials are from an issuer that they trust. _IDEM_ is designed to be used by third parties who require their customers to be KYC'd, such as cryptocurrency exchanges (e.g. [Get Paid In Bitcoin](https://portal.getpaidinbitcoin.com.au)).


Each time an exchange requests an ID from a new user, the KYC provider charges the exchange a fee. Users are required to provide KYC information and have it verified for each and every exchange onboarding instead of being able to reuse verification from a trusted provider. By locally storing users' verified information with a cryptographic signature, we can enhance the onboarding experience and reduce costs incurred by vendors.

## The Tech

_IDEM_ uses several cryptographic protocols to sign and encrypt data. _PGP/GPG_ encryption is used to securely store data on a device, while the _Ethereum Elliptic Curve (ECDSA)_ is used to sign claims which conform to the DID foundation's verifiable claims schema. Anyone can verify that interactions involving _IDEM_ are valid. Furthermore, verification doesn't involve the user's private key (which is never known by _IDEM_).

IDEM's public keys can be found at `https://idem.com.au/keys`

## User Flow Experience - Customer Point of View

Here are two common scenarios involving a user and a participating third-party website ("the website"):

1. Onboarding / registering new users who do not have an account on a website (User Story 1)
2. Verifying existing users (User Story 2)

However, I must complete their profile on the app before any third-party interactions.

### Creating your profile on the IDEM app

#### 1: New IDEM profile creation

A user downloads the _IDEM_ app on their mobile device and creates a new local profile. Their email address is their unique identifier.  The user creates their profile with all relevant claims, such as phone number and date of birth.  _See claims table for a full list._

#### 2: Setting or creating a private key

_IDEM_ can automatically create a 256-bit private key on the device or it can allow the user to import a mnemonic seed phrase (based on the bitcoin BIP39 standard) of their choice. This will be used to sign and verify requests (using elliptic curve cryptography - Secp256k1) to third parties.

#### 3: Attaching documents to claims

The user can choose certain types of claims to verify such as _18+_, _Date of Birth_ or _Address_. They have to substantiate those claims with supporting evidence such as a government-issued document (passport, driver's license, etc.), a utility bill, etc. The documents are encrypted and stored in the local storage of the device.

Once the following is completed, IDEM users can now onboard to websites or exchanges in the following ways!

### User Story 1. New (to the website or exchange) user

The user initiates the registration process by entering their email address and a password into the website. The use of Recaptchas on most websites rules out a full-fledged _IDEM_ registration, although _IDEM_ could be used to fill the email address and generate a password on behalf of the user. From here, the user can use _IDEM_ to complete the verification process by allowing _IDEM_ to supply the claims the website requires.

```text
As a frustrated crypto customer,
I want to onboard to an exchange via the IDEM app,
So that I don't have to resupply all my information again and again and again!
```

```text
Given an IDEM user,
When they visit the demo.idem.com.au registration page,
And they scan the QR code via the app,
And click 'OK' on the app,
Then they are registered on demo.idem.com.au,
And their ID is verified,
And they are redirected to demo.idem.com.au's home page.
```

Websites or exchanges can interact with _IDEM_ users in the following ways;

#### Via a notification

An IDEM user initiates the registration process by entering their email address on the website or exchange. The website can then attempt to notify the IDEM user via the idem proxy https://proxy.idem.com.au with a SHA256 hash of the users email.


Should that user be known to IDEM, the exchange request the claims of the user to complete their registration.  See claims table below.

```bash
curl https://proxy.idem.com.au
```


#### Vai a QR code

Instead of the user having to complete a registration process on the website or exchange, the website or exchange can ask for users IDEM claims via a QR code.


### Via the app

Websites and exchange who have integrated with IDEM, can list their site on the "supported exchanges" tab on the app.  See the How To guide for businesses on how to integrate.


### User Story 2. Existing (to the website or exchange) user

An existing website user can log into the website and is then shown a QR code on their profile page or similar.  The QR code specifies the claims the website requires in their profile.  Once the user can scan the QR code (using _IDEM_) and they confirm the claims they want to share, the app then POSTs the claims to the website's API in the WC3 VC format for the website to validate and save.

```text
As an existing unverified customer of the website,
I want to update my profile with verified claims,
So that I don't need to complete yet another KYC process.
```

```text
Given an IDEM user,
When they visit the website,
And they login with their existing account details,
And they scan the QR code via the app,
And agree to share data on the app to the website,
Then their ID is posted from the app to the website's API,
And the IDEM signature is verified,
And their personal data is updated on the website
```
#### Verification Workflow Diagram

The flowchart below is a verification workflow diagram (User story 2) for third-party developers to integrate a website (such as an exchange) with _IDEM_. It works as follows:

1. A user creates an account on the website, typically with an email and password.
2. The new user may then be asked to supply more information to meet KYC obligations. This could be metadata such as Full Name, Date of Birth and Physical address. These are what IDEM refers to as _Claims_. To capture this data, the website can either;
- Get the user to fill out a form or,
- Present a self documenting QR code requesting the claims required, and the callback URL for the website. This is similar to a PayPal IPN or an OAuth2 callback URL.
3. The user is asked to confirm they're happy to proceed with sharing those specific claims to the website.
4. IDEM then POSTs the claims in WC3 VC format to the websites specified callback URL, which it can then add to the users profile.

OUT OF DATE, TO BE REPLACED: <img src="https://user-images.githubusercontent.com/91101134/141231224-ad845a7c-d336-43cb-b9ea-a2d7c3f1a021.jpeg" width=100% height=100%>

## Implementation

### 1. Onboarding on Third-Party Sites

The site "idem.com.au/demo" creates a unique deeplink url with the url schema `did://` along with the claims it requires:

- callback: URL
- nonce: UUID (also used in challenge)
- claims: Array of claims required

Eg: `did://callback=https://demo.idem.com.au/callback/?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=EmailCredential,NameCredential`


<img src="https://user-images.githubusercontent.com/8411406/171374486-f2112f4e-f45e-43c2-be09-b1bb58b8f463.png" width=200px>

### 2. Verifying the claims

_IDEM_ will then check to see if it already has those claims. If it does, skip to step 4. If it doesn't, it will use the _idem-api_ module to obtain the relevant credentials which are verified by third-party KYC vendors and who return an X-509 SSL certificate signed JSON object that can then be reused. Each vendor has a different process for onboarding and the app will maintain these different business requirements.

<img src="https://user-images.githubusercontent.com/91101134/174712724-32f42982-344a-4d62-bb0b-8dc61824b837.png" width=100% height=100%>

### 3. Shaping the response from the API

The claims will be packaged by the _idem-api_ module as a (Verifiable Presentation)[https://www.w3.org/TR/vc-data-model/#presentations], which is just a wrapped collection of credentials conforming to the W3C Verifiable Credentials Data Model (see JSON model below) and returned, having been signed using Secp256k1, to _IDEN_. _IDEM_ then caches the signed presentation for subsequent requests.

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1", "https://schema.org"],
  "type": "VerifiablePresentation",
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2022-03-01T12:00:00Z",
    "proofPurpose": "authentication",
    "verificationMethod": "did:idem:0x8444F8EF5694F09110B5191fCfab012f2E974135",
    "challenge": "8b5c66c0-bceb-40b4-b099-d31b127bf7b3",
    "domain": "https://idem.com.au",
    "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kTCYt5XsITJX1CxPCT8yAV-TVIw5WEuts01mq-pQy7UJiN5mgREEMGlv50aqzpqh4Qq_PbChOMqsLfRoPsnsgxD-WUcX16dUOqV0G_zS245-kronKb78cPktb3rk-BuQy72IFLN25DYuNzVBAh4vGHSrQyHUGlcTwLtjPAnKb78"
  },
  "verifiableCredential": [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "NameCredential"],
      "issuer": "https://idem.com.au/",
      "issuanceDate": "2022-03-01T12:00:00Z",
      "expirationDate": "2023-03-01T12:00:00Z",
      "credentialSubject": {
        "givenName": "Ralph",
        "familyName": "Lavelle"
      },
      "proof": {
        "type": "EcdsaSecp256k1Signature2019",
        "created": "2022-03-01T12:00:00Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "https://idem.com.au/keys/0x645cD9fE9620649BF71a806bE803695B02f697Aa",
        "signature": "0x7b0a2020202020202263726564656e7469616c5375626a656374223a207b0a202020202020202022656d61696c223a2022656d61696c40646c74782e696f220a2020202020207d2c0a2020202020202265787069726174696f6e44617465223a2022323032332d30332d30315431323a30303a30305a222c0a2020202020202269737375616e636544617465223a2022323032322d30332d30315431323a30303a30305a222c0a20202020202022697373756572223a2022307836343563443966453936323036343942463731613830366245383033363935423032663639374161222c0a2020202020202274797065223a205b22456d61696c5375626a656374225d0a202020207d",
        "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM"
      }
    },
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "EmailCredential"],
      "issuer": "https://idem.com.au/",
      "issuanceDate": "2022-03-01T12:00:00Z",
      "expirationDate": "2023-03-01T12:00:00Z",
      "credentialSubject": {
        "email": "ralph.lavelle@dltx.io"
      },
      "proof": {
        "type": "EcdsaSecp256k1Signature2019",
        "created": "2022-03-01T12:00:00Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "https://idem.com.au/keys/0x645cD9fE9620649BF71a806bE803695B02f697Aa",
        "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM"
      }
    }
  ]
}
```

![vc](https://user-images.githubusercontent.com/8411406/161453157-9ef4942f-4ebe-40d1-98e1-16abeb204047.png)

c# Verifiable Credential model

### 4. Posting the signed data back to the exchange

Finally, _IDEM_ sends the credentials payload back to the website. Upon receipt of the credentials, the website authenticates the signature against the payload and shows a success message to the user. Obviously, it's up to the website to handle the success or failure of the verification of the user in whatever way it sees fit.

## Table of claims

| **CredentialSubject**   | **Mnemonic**     | **Standard**            | **Description**            |
| ------------------- | ------------ | ------------------- | ---------------------- |
| AdultCredential     | eighteenplus | 18 Plus                             | 18 Plus                |
| BirthCredential     | dob          | YYYY-MM-DD ISO 8601                 | Users date of birth    |
| NameCredential      | fullname     | given name, family name, middle name| Users full name        |
| EmailCredential     | email        | email@email.email                   | Users email address    |
| MobileCredential    | mobilenumber | /^(\+\d{1,3}[- ]?)?\d{10}$/       | Users mobile number    |
| AddressCredential   | address      | Physical Address                    | Users physical address |
| TaxCredential       | taxnumber    | [0-9]{9}                      | Users tax file number  |

## Table of documents
| **Key**  | **Document**                 | **Details**                                                                                                                                                          | **Document contents**                                                                  | **Document type** | **Has photo ID?** | **Can be used as a supporting document for?**                        |
|----------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|-------------------|-------------------|----------------------------------------------------------------------|
| **0x00** | Australian driver licence    | A driver licence with your photo issued in your name. This includes physical and digital driver licences, learner permits and provisional licences.                  | Given name, middle, family name, dob, license number, residential address              | Primary           | Yes               | AdultCredential, BirthCredential,  NameCredential, AddressCredential |
| **0x01** | Australian passport          | A passport issued by a country.                                                                                                                                      | Given name, middle name, family name, residential address, DOB, passport number        | Primary           | Yes               | BirthCredential,  NameCredential, AddressCredential                  |
| **0x02** | Australian birth certificate | A full birth certificate in your name or former name issued by Births, Deaths and Marriages. We can’t accept birth extracts or birth cards.                          | Given name, middle name, family name, DOB                                              | Primary           | No                | BirthCredential,  NameCredential                                     |
| **0x03** | Bank statement               | A bank statement issued in your name. Must be issued within the last 3 months.                                                                                       | Given name, middle name, family name, residential address                              | Secondary         | No                | NameCredential, AddressCredential                                    |
| **0x04** | Rates notice                 | A paid rates notice issued in your name with your address that is less than 12 months old.                                                                           | Given name, middle name, family name, residential address                              | Secondary         | No                | NameCredential, AddressCredential                                    |
| **0x05** | Utility account              | Water, gas, electricity or phone account with a receipt number. This must be in your name, show your address and be less than 12 months old. Must be a paid account. | Given name, middle name, family name, residential address                              | Secondary         | No                | AddressCredential                                                    |
| **0x06** | Medicare Card                | A current Medicare Card issued in your name.                                                                                                                         | Given name, middle name, family name, medicare number, position in family | Secondary         | No                | NameCredential                                                       |


## Glossary of Terms

* Document Type: Each file can be associated with a document type, or category, such as "Driver's License" or "Passport".

* File: A file is a digital representation of a document, such as jpgs, pngs, pdfs, etc. In IDEM, users can upload jpg and pdf files.

* Document: A document is a file that a user has uploaded and labeled with a document type. Documents can be used as evidence for various claim.

* Claim: A claim is a statement that the user is asserting as true. A claim can be verified as true by attaching evidence in the form of documents and completing the relevant verification process.

## Test Vectors

BIP39 seed `excite hospital vast lounge please rebel evolve limit planet taste bronze side`

| Name  | Address                                    | Private Key                                                        |
| ----- | ------------------------------------------ | ------------------------------------------------------------------ |
| IDEM  | 0x645cD9fE9620649BF71a806bE803695B02f697Aa | 0xcaf6a36710a30e92d8ae27d2110772f14d077a813183091d16af04c71b93bb96 |
| Alice | 0x8444F8EF5694F09110B5191fCfab012f2E974135 | 0x409f3c9850a095fb1e3967bb55507df2b85bc647d9bc601528d5eb1094deeacc |

## References

* https://www.servicesaustralia.gov.au/individuals/topics/confirm-your-identity/29166
* https://en.bitcoin.it/wiki/Seed_phrase
* Transactions on the Ethereum Test Network "Kovan" will be signed with the ETH account `0xE4ed9ceF6989CFE9da7c1Eec8c2299141dD9e7cC`
* [Microsoft claims class for .net](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0).
