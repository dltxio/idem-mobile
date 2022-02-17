﻿﻿import React from "react";
import { Text, View, ViewStyle } from "react-native";
import styles from "../../styles";
import Button from "../../components/Button";
import vendorRegister from "../../helpers/site/register";
import { useRootStore } from "../../store/rootStore";
import { observer } from "mobx-react-lite";

const Vendor = () => {
  const rootStore = useRootStore();
  const vendor = rootStore.Assets.selectedVendor;

  if (vendor == null) return null;

  return (
    <View style={styles.vendor.root as ViewStyle}>
      <Text style={styles.vendor.title}>{vendor.name}</Text>
      <Text style={styles.vendor.url}>{vendor.url}</Text>
      <Text style={styles.vendor.description}>{vendor.description}</Text>
      <View style={styles.vendor.claimsWrapper(styles.layout.window)}>
        <Text style={styles.vendor.claimsTitle}>Claims requested</Text>
        {rootStore.Assets.selectedVendorClaims.map((item, index) => {
          return (
            <Text style={styles.vendor.claimValue} key={index}>
              {Object.keys(item)[0]}
            </Text>
          );
        })}
      </View>
      <Button
        title="Register"
        style={styles.vendor.registerButton as ViewStyle}
        onPress={() => vendorRegister(vendor)}
      />
    </View>
  );
};

export default observer(Vendor);
