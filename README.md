# idem-mobile
React native mobile app for Idem

# idem-mobile
React native mobile app for Idem
[![deploy-docker](https://github.com/dltxio/idem/actions/workflows/docker-image.yml/badge.svg)](https://github.com/dltxio/idem/actions/workflows/docker-image.yml)

## Abstract

Idem is an open source cross platform mobile application based on the Decentralised Identity Foundations DID protocol. The mobile application will give individuals control of their digital identities by establishing trust in an interaction between two individuals or entities that do not know each other. For trust to happen, the offering party will present credentials to the receiving parties, which can verify that the credentials are from an issuer that they trust.

Each time an exchange requests an ID from a new user, the KYC provider charges the exchange a fee. Users are required to provide KYC information and have it verified for each and every exchange onboarding instead of being able to reuse verification from a trusted provider. By locally storing user's verified information with a cryptographic signature, we can enhance the customer onboarding experience and reduce costs incurred by vendors.

## The Tech
Idem uses a number of cryptographic protocols to sign and encrypt your data. PGP/GPG encryption is used to securely store data on your device, while the Ethereum elliptic curve (ECDSA) is used to sign claims which conforms to the DID foundations verifiable claims schema. Specifically, anyone can verify that the transaction is valid. The verification doesn't involve the users private key and is never known by Idem.

## What is Idem?
Idem is designed to be used by third parties who require their customers to by KYC'd, such as crypto currency exchanges.  There are two ways in which the Idem app can be used: 

1. Onboarding / Registering new users who do not have an account on the third party platform (User Story 1)
2. Verification exsiting users (User Story 2)

### User Story 1:  Onboarding a new user
```text
As a frustrated crypto customer, 
I want to onboard to the exchange via the Idem app, 
So that I don't have to re-supply all my information again and again and again!
```

```text
Given an Idem user,  
When they visit demo.idem.com.au registration page,  
And they scan the QR code via the app,  
And Ok on the app,  
Then they are registered on demo.idem.com.au,
And their ID is verified,  
And they are redirected to demo.idem.com.au's home page.
```
### User Story 2:  Verify an already registered user
```text
As an existing unverified customer of demo.idem.com.au,
I want to verify my KYC requirements via the Idem app,
So that I don't need to complete yet another KYC process.
```

```text
Given an Idem user,  
When they visit demo.idem.com.au,  
And they scan the QR code via the app,  
And OK to sharing data on the app to demo.idem.com.au,  
Then their ID is posted from the app to demo.idem.com.au's API,
And their Idem signature is verified,
And their personal data is updated at demo.idem.com.au
```

## Creating a profile on your Idem app

### Step 1: New Idem registration
A user creates a new local profile on their mobile device using the Idem app.  Their email address is their as a unique identifier.

### Step 2: New private key
The app will automatically create a 256-bit private key on the device or allow users to import a mnemonic seed phrase based on the bitcoin BIP39 standard. This will be used to sign and verify requests using ECDSA to third parties.

### Step 3: Upload data
Users can choose certain types of claims to verify such as 18+, Date of Birth or Address. They are required to substantiate any of those claims with supporting evidence such as a government issued document, utilities bill etc. The documents are enrcypeted and stored in the local storage of the device along with a keccak 256 hash and signed by the ECDSA curve.

Meta data is stored in a W3 Verifiable claims JSON object https://www.w3.org/TR/vc-data-model/#contexts:

```json
{
    "connectionID": "16bcs3-vxc123",
    "claims": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
            ],
            "type": ["VerifiableCredential", "EmailCredential"],
            "issuanceDate": "2020-01-01T19:73:24Z",
            "credentialSubject": {
                "name": "Email",
                "value": "test@dltx.io",
            },
            "proof": {}
        },{
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
            ],
            "type": ["VerifiableCredential", "NameCredential"],
            "issuanceDate": "2020-01-01T19:73:24Z",
            "credentialSubject": {
                "name": "fullname",
                "value": "Mr John Doe",
            },
            "proof": {}
        },{
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
            ],
            "type": ["VerifiableCredential", "DateOfBirthCredential"],
            "issuanceDate": "2020-01-01T19:73:24Z",
            "credentialSubject": {
                "name": "dob",
                "value": "1998-01-01T00:00:00Z",
            },
            "proof": {}
        }
    ]
}
```

Note:  See the Microsoft claims class for .net https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0

## User Flow Experience - Customer Point of View
The flowchart below is a user work flow demonstrating the user experience. Here we present 3 User scenarios.

### Existing Idem User
An existing Idem User will be able to log in to a participating (third party) website by simply using the Idem App to scan the QR code displayed on the participating website. Once authenticated, the User will be able to:

1. Update their claims such as Date of Birth, name and address using the verified data on the Idem app.
2. Supply verified evidence in the form of documents to the participating website.

### New User
A new user will initiate the registration process by entering their email address and a new password in to the participating (third party) website. At this point if the user does not complete the registration process, the new user will be able to return to the website and log in using the QR code displayed on the screen when returning to the same website. Once the New User logs in and is inside the website, the new Idem User will continue with the verification process, uploading the requested documents on the website using the Idem App. Once documents have been submitted and verified, the User will be able to:

i)	Register credentials on the website using Idem credentials.

ii)	Verify documents using Idem verified documents.

<img src="https://user-images.githubusercontent.com/91101134/141231143-676d3413-ac01-462a-9fac-ee0b4fd509a3.jpeg" width=100% height=100%>

## Verification Workflow Diagram
The flowchart below is a verification workflow diagram for 3rd party developers to integrate their Exchange or website with Idem. It works as follows:

<img src="https://user-images.githubusercontent.com/91101134/141231224-ad845a7c-d336-43cb-b9ea-a2d7c3f1a021.jpeg" width=100% height=100%>

## User Story 2:  Verify an already registered user

1. A user with no digital ID visits “demo.idem.com.au” and creates an account by entering their email address and password (a user with a registered ID will scan a QR code and log in directly).

2. The "demo.idem.com.au" site will request give access to the user to enter the site (dashboard).

3. A user with a registered ID will scan a QR code and have their claims verified directly. A new user will be asked to verify their claims using Idem. Specifically, this means that a user will verify specific information that is requested from them that is considered to be true, such as their name, address, etc. The user will be able to verify using existing (“old” implies already verified however document may have expired or not yet verified) mechanisms which involve uploading KYC documents (driver’s license / passports etc).

4. The user scans external QR codes, which requests specific information from the user held in Idem.

5. The user checks the information being requested in Idem, approves the claims request and Idem verifies the claim and the user gains access to external site.

6. The App posts the API specified in the QR code. Two options are to be made available:

i) The App will post to the Exchange directly - see point 7. below.
ii) The App will use ECDSA to sign the certificates using Idem.
	
7. Provide call back option for ECDSA authentication to validate SSL Certificates over HTTP in Exchange, and option for Exchange to whitelist IP addresses.

8. The Exchange verifies the user’s claims and lets Idem know. Webhook needed to tie to the Exchange to let Idem know the results of the verification (eg when the verification is complete, or whether more information is needed etc).

9. Sends users to Home Page which displays verified documents.

### Implementation
### Step 1:  Onboarding on Third-Party Sites
The site "demo.idem.com.au" creates a unique deeplink url with the url schema `did://` along with the claims it requires:

* Domain (mandatory)
* Call back path
* Nonce as UUID (mandatory)
* An array of claims required

Eg: `did://callback=demo.idem.com.au&callback=/verify?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=[0x01]`

### Step 2:  Posting the signed data to the exchange
The user will then receive confirmation alert on the device with the claims the exchange is requesting as specified in the deeplink.  Should the user accept that request for claims, the app will the post the claims in the following DID schema.

```json
TBA
```


Often a site will email a user once they have created an account with an email address and password.  At this step, the site could also pass an unsigned url for the users to scan with their Idem app to validate their email and other claims.

A QR code deeplink is a URL providing the claims required by site, along with a call back url.  


## Verify these claims
These claims are then verified by third-party KYC vendors who return an X-509 SSL certificate signed JSON object that can then be used again. Each vendor has a different process for onboarding and the app will maintain these different business requirements.

<img src="https://user-images.githubusercontent.com/91101134/141231805-bbbfc5e8-341e-4d7e-b2f9-ff8015652fd1.jpeg" width=100% height=100%>

## Appendix

### Routes
TBA  

### Registration Schema
TBA  

### Table of claims

| Key | Subject | Mnemonic | Standard | Description |
|---|---|---|---|---|
| 0x00 | 18+ | eighteenplus | 18 Plus | 18 Plus | 
| 0x01 | Date of Birth | dob | YYYY-MM-DD ISO 8601 | Users Date of Birth | 
| 0x02 | Full Name | fullname | | Users Full Name |
| 0x03 | Email | email | email | Users email address  | 
| 0x04 | Mobile Number | mobilenumber | Mobile Number | Users mobile number | 
| 0x05 | Address | address | Physical Address | Users physical address | 
| 0x06 | Birth Year | birthyear | YYYY ISO 8601 | Users Year of Birth |


### Table of claims data types

| Name | Value |
| --- | --- |
| decimal | |
| boolean | |
| integer | |
| email | |
| date | |
| datetime |

### Table of documents

| Key | Document | Details
| --- | --- | ---
| 0x00 | Australian birth certificate | A full birth certificate in your name or former name issued by State Authority of Births, Deaths and Marriages. We cannot accept birth extracts or birth cards.
| 0x01 | Australian driver licence | A current driver licence with your photo issued in your name. This includes physical and digital driver licences, current learner permits, and provisional licences. 

### Trusted ID verification providers

A smart contract contains a struct of trusted providers.  The providers can only be granted or revoked by an independent third party, such as Blockchain Australia, DataZoo etc.


## References

https://www.servicesaustralia.gov.au/individuals/topics/confirm-your-identity/29166
https://en.bitcoin.it/wiki/Seed_phrase
https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0
Transactions on the Ethereum Test Network "Kovan" will be signed with the ETH account `0xE4ed9ceF6989CFE9da7c1Eec8c2299141dD9e7cC`
