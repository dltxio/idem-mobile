### Android Emulator

1. Download the latest "IDEM Android internal distribution build" apk file from https://expo.dev/accounts/dltx/projects/IDEM/builds
2. Launch emulator
3. Drag apk into emulator to install

### Android Physical

1. Find the latest "IDEM Android internal distribution build" from https://expo.dev/accounts/dltx/projects/IDEM/builds
2. Clicking install will bring a QR code to access the page on your device
3. Download .apk to your phone
4. Follow install instructions on your device

### iOS Simulator

1. Find the latest "IDEM iOS simulator build" from https://expo.dev/accounts/dltx/projects/IDEM/builds
2. Download .tar.gz file to your computer
3. Decompress .tar.gz (decompressed file should be called idemID.app)
4. Launch the simulator
5. Drag idemID.app onto the simulator to install

### Building for iOS Physical (FIRST TIME RUN ONLY)

1. On an iOS device go to https://expo.dev/register-device/56f0712e-ff59-4c1f-ae0e-11a96262f650
2. Follow instructions to install ad hoc provisioning profile
3. Run: `eas build --profile development -p ios`
4. Log into DLTx developer apple account
5. Use the left and right arrow keys to select SMS for confirmation code
6. Code will be sent to Steves phone (You will need to ask for the code)
7. Choose to reselect devices to provision
8. Using left/right arrow keys, enable all available devices
9. Don't set up push notifications
10. Wait for build to finish
11. When build is finished download to iOS device
12. Follow install instructions on the device

## Running the app on your device

1. Find the latest "internal distribution build" from https://expo.dev/accounts/dltx/projects/IDEM/builds
2. Scan the install QR code with your device to download the app onto your device
3. Start expo on your host machine
4. Scan the QR code from expo to open IDEM on your device
5. Wait for the JavaScript to bundle
6. If the app isn't loading try closing the app on your device and relaunching with expo repeatedly

## NOTE 
If you want to build for ios successfully you will need to add the following to the app.json (Only add for builds)

 [
        "expo-document-picker",
        {
          "appleTeamId": "FRG84WT9XZ",
          "iCloudContainerEnvironment": "Production"
        }
      ]

**If a new package is added to the project, a new build will need to be made and everyone will need to download the newest internal distribution build**

## Testing GreenID Verification
* set driver's licence number to 11111111
* set medicare card number to 2111111111

### Testing documentation for greenID verification
https://vixverify.atlassian.net/wiki/spaces/GREEN/pages/8880678/Data+Testing#DataTesting-Codesforinteractivechecks(Australia)