import Constants from "expo-constants";

const devConfig: config.Config = {
  // apiEndpoint: Constants?.manifest?.extra?.apiEndpoint,
  // userName: Constants?.manifest?.extra?.userName,
  // password: Constants?.manifest?.extra?.password,
  // sentryDSN: Constants?.manifest?.extra?.sentryDSN,
  // sentryDebugEnable: Constants?.manifest?.extra?.sentryDebugEnable,
  // partnersUrl: Constants?.manifest?.extra?.exchangeSitesJsonUrl
  apiEndpoint: "",
  userName: "",
  password: "",
  sentryDSN: "",
  sentryDebugEnable: false,
  partnersUrl:
    "https://raw.githubusercontent.com/dltxio/idem-mobile/development/data/sites.json"
};

const getChannelConfig = () => {
  return devConfig;
};

const config: config.Config = {
  ...getChannelConfig()
};

export default config;
