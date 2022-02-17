import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, ViewStyle } from "react-native";
import DatePick from "../../components/DatePick";
import styles from "../../styles";
import { colors } from "../../styles/theme";
import { verifyClaim } from "../../helpers/claim/verify";
import Button from "../../components/Button";
import moment from "moment";
import useClaims from "../../hooks/useClaims";

const DateClaim = ({
  item,
  uploadFileFromBrowser,
}: {
  item: server.Claim;
  uploadFileFromBrowser: () => void;
}) => {
  const [showDate, setShowDate] = useState(false);
  const { setClaim } = useClaims();
  const value = item.credentialSubject.value;
  
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => setShowDate(!showDate)}
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
        }}
      >
        <Text style={{ color: value ? undefined : colors.gray }}>{`${
          moment(value).format("DD/MM/YYYY") ||
          "Please enter the specific date..."
        }`}</Text>
      </TouchableOpacity>
      <DatePick
        show={showDate}
        handleCloseDate={() => {
          setShowDate(false);
        }}
        handleDateChange={(value: Date) => {
          setClaim(item.key, value.toISOString());
          setShowDate(false);
        }}
      />
      <Button
        title="Add Supporting Document From Device"
        style={styles.claim.uploadButton as ViewStyle}
        onPress={uploadFileFromBrowser}
      />
      <Button
        title="Verify"
        style={styles.claim.verifyButton as ViewStyle}
        disabled={true}
        onPress={() => verifyClaim(item)}
      />
    </View>
  );
};

export default observer(DateClaim);
