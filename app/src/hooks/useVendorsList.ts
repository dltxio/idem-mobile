import React from "react";
import { Vendor } from "../types/common";
import axios from "axios";
import config from "../../config";

export type GetPartnersResponse = {
  data: Vendor[];
};

type Hooks = {
  partners: Vendor[];
  getPartners: () => Promise<void>;
};

const useVendorsList = (): Hooks => {
  const [partners, setPartners] = React.useState<Vendor[]>([]);

  const getPartners = async () => {
    try {
      const sitesUrl = config.exchangeSitesJsonUrl;
      if (sitesUrl) {
        const { data: partners }: GetPartnersResponse = await axios.get(
          sitesUrl
        );
        setPartners(partners);
      }
    } catch (error) {
      const err = error as any;
      console.error(err?.response?.data || error);
    }
  };

  React.useLayoutEffect(() => {
    getPartners();
  }, []);

  return { partners, getPartners };
};

export default useVendorsList;
