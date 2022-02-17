import React from "react";
import { Text, View, Platform, Modal, Pressable, Alert } from "react-native";
import { useRootStore } from "../../store/rootStore";
import styles from "../../styles";
import EthSetting from "./EthSetting";
import PgpSetting from "./PgpSetting";

const Setting = () => {
  const rootStore = useRootStore();
  const settings = rootStore.Assets.selectedSetting;

  if (!settings) {
    return <View>{/* TODO: error handling for this case */}</View>;
  }

  const renderSetting = (key: string) => {
    switch (key) {
      case "1x00":
        return <EthSetting />;
      case "1x01":
        return <PgpSetting />;
    }
  };
  return (
    <>
      <View style={styles.claim.root}>
        <Text style={styles.claim.title}>{settings?.name}</Text>
        <Text style={styles.claim.label}>{settings?.description}</Text>
        {renderSetting(settings.key || "")}
      </View>
    </>
  );
};

export default Setting;
