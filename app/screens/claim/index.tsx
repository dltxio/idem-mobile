﻿import React, { useEffect, useState } from "react";
import { Text, View, Platform, Modal, Pressable, Alert } from "react-native";
import styles from "../../styles";
import EmailClaim from "./EmailClaim";
import { observer } from "mobx-react-lite";
import DateClaim from "./DateClaim";
import OtherClaim from "./OtherClaim";
import MobileClaim from "./MobileClaim";
import SelectClaim from "./SelectClaim";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import styless from "./Styless";
import useClaims from "../../hooks/useClaims";

const Claim = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayFileName, setDisplayFileName] = useState(false);
  const [image, setImage] = useState(String);
  const [imageInfo, setImageInfo] = useState(Object);
  const [libraryName, setLibraryName] = useState(String);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const getData = async (result: any) => ({
    hash: await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      result.uri,
    ),
    base64Url: result.uri,
  });

  const uploadFileFromBrowser = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === "success") {
        const base64Img = await FileSystem.readAsStringAsync(result.uri, {
          encoding: "base64",
        });
        setImageInfo(result);
        setModalVisible(true);
        setImage(base64Img);
        setLibraryName("browser");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const uploadPhotoFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!result.cancelled) {
        const base64Img = await FileSystem.readAsStringAsync(result.uri, {
          encoding: "base64",
        });
        setModalVisible(true);
        setImage(base64Img);
        setLibraryName("gallery");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const uploadPhotoFromCamera = async () => {
    try {
      // Ask the user for the permission to access the camera
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your camera!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync();
      // Explore the result
      if (!result.cancelled) {
        const base64Img = await FileSystem.readAsStringAsync(result.uri, {
          encoding: "base64",
        });
        setModalVisible(true);
        setImage(base64Img);
        setLibraryName("camera");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const claimsDocuments = async () => {
    if (image) {
      if (libraryName === "browser") {
        await AsyncStorage.setItem("document_url", image);
      }
      if (libraryName === "gallery") {
        await AsyncStorage.setItem("library_url", image);
      }
      if (libraryName === "camera") {
        await AsyncStorage.setItem("camera_url", image);
      }
      setDisplayFileName(true);
      setModalVisible(false);
    }
  };
  const { selectedClaim } = useClaims();

  if (!selectedClaim) {
    return <View>{/* TODO: error handling for this case */}</View>;
  }

  const renderClaim = (type: string[]) => {
    if (type.includes("DateOfBirthCredential")) {
      return (
        <DateClaim
          item={selectedClaim}
          uploadFileFromBrowser={uploadFileFromBrowser}
        />
      );
    } else if (type.includes("EmailCredential")) {
      return (<EmailClaim item={selectedClaim} />);
    } else if (type.includes("MobileNumberCredential")) {
      return (<MobileClaim item={selectedClaim} />);
    } else if (type.includes("18+")) {
      return (
        <SelectClaim
          item={selectedClaim}
          uploadPhotoFromCamera={uploadPhotoFromCamera}
          uploadFileFromBrowser={uploadFileFromBrowser}
          uploadPhotoFromLibrary={uploadPhotoFromLibrary}
          imageInfo={imageInfo}
          displayFileName={displayFileName}
        /> 
      );
    } else {
      return (
        <OtherClaim
          item={selectedClaim}
          uploadFileFromBrowser={uploadFileFromBrowser}
        />
      );
    }
  };

  return (
    <>
      <View style={styles.claim.root}>
        <Text style={styles.claim.title}>{selectedClaim?.title}</Text>
        {renderClaim(selectedClaim.type || [])}
      </View>

      {modalVisible && (
        <View style={styless.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styless.centeredView}>
              <View style={styless.modalView}>
                <Text style={styless.modalText}>
                  Are you sure, you want to select this image/document for
                  claims?{" "}
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Pressable
                    style={[styless.button, styless.buttonClose]}
                    onPress={claimsDocuments}
                  >
                    <Text style={styless.textStyle}>Yes</Text>
                  </Pressable>
                  <Pressable
                    style={[styless.button, styless.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styless.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

export default observer(Claim);
