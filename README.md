# idem-mobile

React native mobile app for Idem

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

![build status main branch](https://github.com/dltxio/idem-mobile/workflows/CI/badge.svg?branch=main)

To run the app

```bash
yarn install
cd app
yarn start
```

## Glossary of Terms

Document Type: Each file can be associated with a document type, or category, such as "Driver's License" or "Passport".

File: A file is a digital representation of a document, such as jpgs, pngs, pdfs, etc. In IDEM, users can upload jpg and pdf files.

Document: A document is a file that a user has uploaded and labeled with a document type. Documents can be used as evidence for various claim.

Claim: A claim is a statement that the user is asserting as true. A claim can be verified as true by attaching evidence to it and completing the relevant verification process.

## What is Idem?

Idem (_Idem_, from now on) is an open source cross-platform mobile application based on the [Decentralised Identity Foundation's DID protocol](https://identity.foundation). The application will give individuals control of their digital identities by establishing trust in an interaction between two individuals or entities that do not know each other. For trust to happen, the offering party will present credentials to the receiving parties, which can verify that the credentials are from an issuer that they trust. _Idem_ is designed to be used by third parties who require their customers to be KYC'd, such as cryptocurrency exchanges (e.g. [Get Paid In Bitcoin](https://portal.getpaidinbitcoin.com.au)).

Each time an exchange requests an ID from a new user, the KYC provider charges the exchange a fee. Users are required to provide KYC information and have it verified for each and every exchange onboarding instead of being able to reuse verification from a trusted provider. By locally storing users' verified information with a cryptographic signature, we can enhance the onboarding experience and reduce costs incurred by vendors.

## The Tech

_Idem_ uses a number of cryptographic protocols to sign and encrypt data. _PGP/GPG_ encryption is used to securely store data on a device, while the _Ethereum elliptic curve (ECDSA)_ is used to sign claims which conform to the DID foundation's verifiable claims schema. Anyone can verify that transactions involving _Idem_ are valid. Furthermore, verification doesn't involve the user's private key (which is never known by _Idem_).

## Use

There are two ways in which _Idem_ can be used:

1. Onboarding / registering new users who do not have an account on a website (User Story 1)
2. Verifying existing users (User Story 2)

### User Story 1: Onboarding a new user

```text
As a frustrated crypto customer,
I want to onboard to an exchange via the Idem app,
So that I don't have to resupply all my information again and again and again!
```

```text
Given an Idem user,
When they visit the demo.idem.com.au registration page,
And they scan the QR code via the app,
And click 'OK' on the app,
Then they are registered on demo.idem.com.au,
And their ID is verified,
And they are redirected to demo.idem.com.au's home page.
```

### User Story 2: Verify an already registered user

```text
As an existing unverified customer of demo.idem.com.au,
I want to verify my KYC requirements via Idem,
So that I don't need to complete yet another KYC process.
```

```text
Given an Idem user,
When they visit demo.idem.com.au,
And they scan the QR code via the app,
And agree to share data on the app to demo.idem.com.au,
Then their ID is posted from the app to demo.idem.com.au's API,
And their Idem signature is verified,
And their personal data is updated at demo.idem.com.au
```

## Creating a profile on your Idem app

### 1: New IDEM registration

A user downlooads _Idem_ on their mobile device and creates a new local profile on the app. Their email address is their unique identifier.

### 2: New private key

_Idem_ can automatically create a 256-bit private key on the device or the user can import a mnemonic seed phrase (based on the bitcoin BIP39 standard) of their choice. This will be used to sign and verify requests (using elliptic curve crytography - Secp256k1) to third parties.

### 3: Upload data

The user can choose certain types of claims to verify such as _18+_, _Date of Birth_ or _Address_. They have to substantiate those claims with supporting evidence such as a government-issued document (passport, drivers license, etc.), a utilities bill, etc. The documents are encrypted and stored in the local storage of the device.

## User Flow Experience - Customer Point of View

Here are two common scenarios involving a user and a participating third-party website ("the website"):

### 1. New (to the website) user

The user initiates the registration process by entering their email address and a password into the website. The use of Recaptchas on most websites rules out a full-fledged _Idem_ registration, although _Idem_ could be used to fill the email address and generate a password on behalf of the user. From here, the user can use _Idem_ to complete the verification process by allowing _Idem_ to supply the claims the website requires.

### 2. Existing (to the website) non-verified user

An existing user can log into the website, given the user is using the same email address as their claim in IDEM, the user will receive an alert stating "Would you like to use IDEM to verify with the website?" If the user accepts this alert they will be verified on the platform once their claims have been verified.

## Verification Workflow Diagram

The flowchart below is a verification workflow diagram for third-party developers to integrate a website (such as an exchange) with _Idem_. It works as follows:

1. A user creates account on the website, typically with a email and password.
2. The new user may then be assed to supply more information to meet KYC obligations. This could be meta data such as Full Name, Date of Birth and Phyiscal address. These are what IDEM referrers to as _Claims_. To capture this data, the website can either.
  - Get the user to fill out a form.
  - Present a self documenting QR code requesting the claims required, and the callback URL for the website. This is similar to a PayPal IPN or an OAuth2 callback URL.
5. The user is asked to confirm they're happy to proceed with sharing those specific claims to the website.
6. IDEM then posts the claims in DID format to the websites specified callback URL, which it can then add to the users profile.

OUT OF DATE, TO BE REPLACED: <img src="https://user-images.githubusercontent.com/91101134/141231224-ad845a7c-d336-43cb-b9ea-a2d7c3f1a021.jpeg" width=100% height=100%>

## Implementation

### 1. Onboarding on Third-Party Sites

The site "idem.com.au/demo" creates a unique deeplink url with the url schema `did://` along with the claims it requires:

- callback: URL
- nonce: UUID (also used in challenge)
- claims: Array of claims required

Eg: `did://callback=https://demo.idem.com.au/callback/?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=EmailCredential,NameCredential`

<img src=https://user-images.githubusercontent.com/8411406/171374486-f2112f4e-f45e-43c2-be09-b1bb58b8f463.png width=25% height=25%>

### 2. Verifying the claims

_Idem_ will then check to see if it already has those claims. If it does, skip to step 4. If it doesn't, it will use the _idem-api_ module to obtain the relevant credentials which are verified by third-party KYC vendors and who return an X-509 SSL certificate signed JSON object that can then be reused. Each vendor has a different process for onboarding and the app will maintain these different business requirements.

<img src="https://user-images.githubusercontent.com/91101134/174712724-32f42982-344a-4d62-bb0b-8dc61824b837.png" width=100% height=100%>

### 3. Shaping the response from the API

The claims will be packaged by the _idem-api_ module as a (Verifiable Presentation)[https://www.w3.org/TR/vc-data-model/#presentations], which is just a wrapped collection of credentials conforming to the W3C Verifiable Credentials Data Model (see JSON model below) and returned, having been signed using Secp256k1, to _Idem_. _Idem_ then caches the signed presentation for subsequent requests.

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
    "domain": "https://demo.idem.com.au",
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

Finally, _Idem_ sends the credentials payload back to the website. Upon receipt of the credentials, the website authenticates the signature against the payload and shows a success message to the user. Obviously, it's up to the website to handle the success or failure of the verification of the user in whatever way it sees fit.

## Demo/MVP

For the sake of getting things done, parts of the workflow mentioned here will be left out of early versions of the project. For an MVP scenario, the website will only request claims that _Idem_ already has, thus obviating the involvement of the _idem-api_ module (and therefore the credentials issuers themselves). This is probably what will happen the vast majority of the time, though - users will set themselves up in advnace with whatever they are likely to need to register with an exchange, rather than leave it to when they are actually trying to verify to an exchange.

Note that this 'happy path' will still require _Idem_ to obtain credentials from an issuer for a once-off initial verification.

## Unsure

There may be cases where the _idem-api_ module is able to request the website's callback URL _directly_, without having to route back through _Idem_. The exchange would have to have whitelisted _idem-api_ module's IP address to verify incoming requests from that app.

### Table of claims

| CredentialSubject   | Mnemonic     | Standard            | Description            |
| ------------------- | ------------ | ------------------- | ---------------------- |
| AdultCredential     | eighteenplus | 18 Plus                             | 18 Plus                |
| BirthCredential     | dob          | YYYY-MM-DD ISO 8601                 | Users date of birth    |
| NameCredential      | fullname     | given,name, family name, middle name| Users full name        |
| EmailCredential     | email        | email@email.email                   | Users email address    |
| MobileCredential    | mobilenumber | Mobile Number                       | Users mobile number    |
| AddressCredential   | address      | Physical Address                    | Users physical address |
| BirthYearCredential | birthyear    | YYYY ISO 8601                       | Users year of birth    |
| TaxCredential       | taxnumber    | 9 digit number                      | Users tax file number  |

### Table of documents
| **Key**  | **Document**                 | **Details**                                                                                                                                                          | **Document contents**                                                                  | **Document type** | **Has photo ID?** |
|----------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|-------------------|-------------------|
| **0x00** | Australian driver licence    | A driver licence with your photo issued in your name. This includes physical and digital driver licences, learner permits and provisional licences.                  | Given name, middle, family name, dob, license number, residential address              | Primary           | Yes               |
| **0x01** | Australian passport          | A passport issued by a country.                                                                                                                                      | Given name, middle name, family name, residential address, DOB, passport number        | Primary           | Yes               |
| **0x02** | Australian birth certificate | A full birth certificate in your name or former name issued by Births, Deaths and Marriages. We can’t accept birth extracts or birth cards.                          | Given name, middle name, family name, DOB                                              | Primary           | No                |
| **0x03** | Bank statement               | A bank statement issued in your name. Must be issued within the last 3 months.                                                                                       | Given name, middle name, family name, residential address                              | Secondary         | No                |
| **0x04** | Rates notice                 | A paid rates notice issued in your name with your address that is less than 12 months old.                                                                           | Given name, middle name, family name, residential address                              | Secondary         | No                |
| **0x05** | Utility account              | Water, gas, electricity or phone account with a receipt number. This must be in your name, show your address and be less than 12 months old. Must be a paid account. | Given name, middle name, family name, residential address                              | Secondary         | No                |
| **0x06** | Medicare Card                | A current Medicare Card issued in your name.                                                                                                                         | Given name, middle name, family name, medicare number, expiry date, position in family | Secondary         | No                | 

### Trusted ID verification providers

A smart contract contains a struct of trusted providers. The providers can only be granted or revoked by an independent third party, such as Blockchain Australia, DataZoo etc.

Metadata is stored in a [W3 Verifiable claims](https://www.w3.org/TR/vc-data-model/#contexts:) JSON object:

Note: See the [Microsoft claims class for .net](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0).

## Test Vectors

`excite hospital vast lounge please rebel evolve limit planet taste bronze side`

| Name  | Address                                    | Private Key                                                        |
| ----- | ------------------------------------------ | ------------------------------------------------------------------ |
| Idem  | 0x645cD9fE9620649BF71a806bE803695B02f697Aa | 0xcaf6a36710a30e92d8ae27d2110772f14d077a813183091d16af04c71b93bb96 |
| Alice | 0x8444F8EF5694F09110B5191fCfab012f2E974135 | 0x409f3c9850a095fb1e3967bb55507df2b85bc647d9bc601528d5eb1094deeacc |

## References

https://www.servicesaustralia.gov.au/individuals/topics/confirm-your-identity/29166
https://en.bitcoin.it/wiki/Seed_phrase
https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0
Transactions on the Ethereum Test Network "Kovan" will be signed with the ETH account `0xE4ed9ceF6989CFE9da7c1Eec8c2299141dD9e7cC`

### (Removed Diagrams)

https://user-images.githubusercontent.com/91101134/141231143-676d3413-ac01-462a-9fac-ee0b4fd509a3.jpeg
