import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HeaderLeft from "../components/HeaderLeft";
import HeaderTitle from "../components/HeaderTitle";
import Vendors from "../screens/vendors";
import Vendor from "../screens/vendor";

const Stack = createStackNavigator();

const VendorsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="3rd Party List"
        component={Vendors}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="3rd Parties" />,
        })}
      />
      <Stack.Screen
        name="Vendor"
        component={Vendor}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Vendor" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
