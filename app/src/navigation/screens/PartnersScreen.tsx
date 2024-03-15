import * as React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { ListItem } from "@rneui/themed";
import commonStyles from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { PartnersStackNavigaton } from "../../types/navigation";
import usePartnersLiset from "../../hooks/usePartnersList";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../styles/colors";

type Navigation = PartnersStackNavigaton<"Partners">;

const PartnersScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { partners } = usePartnersLiset();

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.screenContent}>
        <StatusBar hidden={false} />
        {partners.length > 0 &&
          partners.map((partner) => {
            if (partner.enabled) {
              const content = (
                <>
                  <ListItem.Content>
                    <ListItem.Title style={styles.vendorName}>
                      {partner.name}
                    </ListItem.Title>
                  </ListItem.Content>
                  <AntDesign name="right" style={styles.icon} />
                </>
              );

              return (
                <ListItem
                  bottomDivider
                  key={partner.name}
                  onPress={() =>
                    navigation.navigate("VendorDetails", {
                      id: partner.id
                    })
                  }
                >
                  {content}
                </ListItem>
              );
            }
          })}
      </View>
    </View>
  );
};

export default PartnersScreen;

const styles = StyleSheet.create({
  icon: {
    color: colors.black,
    fontSize: 24
  },
  header: {
    color: "black",
    fontSize: 40,
    marginBottom: 10
  },
  vendorName: {
    fontSize: 17
  },
  headingText: {
    right: 100,
    fontWeight: "500" as any,
    fontSize: 18,
    marginBottom: 10
  }
});
