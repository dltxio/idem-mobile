import * as React from "react";
import { View } from "react-native";
import axios from "axios";
import { Vendor } from "../../types/general";
import { ListItem } from "react-native-elements";

type GetVendorsResponse = {
  data: Vendor[];
};

const VendorsScreen: React.FC = () => {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);

  const getVendors = async () => {
    try {
      const { data: vendors }: GetVendorsResponse = await axios.get(
        "https://raw.githubusercontent.com/dltxio/idem-mobile/IDEM-35/data/sites.json"
      );
      setVendors(vendors);
    } catch (error) {
      const err = error as any;
      console.error(err?.response?.data || error);
    }
  };

  React.useLayoutEffect(() => {
    getVendors();
  }, []);

  return (
    <View>
      {vendors.map((vendor) => {
        const vendorList = getVendors();

        if (!vendorList) {
          return null;
        }

        const content = (
          <>
            <ListItem.Content>
              <ListItem.Title>{vendor.name}</ListItem.Title>
            </ListItem.Content>
          </>
        );

        return <ListItem key={vendor.website}>{content}</ListItem>;
      })}
    </View>
  );
};

export default VendorsScreen;
