import React from "react";
import { Vendor } from "../types/general";
import axios from "axios";
import sites from "../sites.json";

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
      setVendors(sites as Vendor[]);
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
