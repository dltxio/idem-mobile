import React from "react";
import { Vendor } from "../types/general";
import axios from "axios";
import exchanges from "../../tests/sites.json";

export type GetVendorsResponse = {
  data: Vendor[];
};

type Hooks = {
  vendors: Vendor[];
  getVendors: () => Promise<void>;
};

const useVendorsList = (): Hooks => {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);

  const getVendors = async () => {
    try {
      // const { data: vendors }: GetVendorsResponse = await axios.get(
      //   "https://raw.githubusercontent.com/dltxio/idem-mobile/main/data/sites.json"
      // );
      setVendors(exchanges as Vendor[]);
    } catch (error) {
      const err = error as any;
      console.error(err?.response?.data || error);
    }
  };

  React.useLayoutEffect(() => {
    getVendors();
  }, []);

  return { vendors, getVendors };
};

export default useVendorsList;
