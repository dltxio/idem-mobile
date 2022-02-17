import config from "../config.dev.json";
import axios from "axios";

export enum AssetType {
  Claims = "claims",
  Vendors = "vendors",
  Settings = "settings",
}

/**
 * @param {Type} "claims"|"vendors" | "settings"
 * @returns {Promise<Object>}
 */
export const fetchAssets = async (assetType: AssetType) => {
  const endpoint = `${config.assets.endpoint}${config.assets[assetType]}`;
  const response = await axios.get(endpoint);
  if (response.data == null)
    throw new Error(`Could not fetch asset data from endpoint "${endpoint}"`);
  return response.data;
};
