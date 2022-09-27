import Constants from "expo-constants";

const devConfig: config.Config = {
  apiEndpoint: Constants?.manifest?.extra?.apiEndpoint,
  userName: Constants?.manifest?.extra?.userName,
  password: Constants?.manifest?.extra?.password,
  sentryDSN: Constants?.manifest?.extra?.sentryDSN,
  sentryDebugEnable: Constants?.manifest?.extra?.sentryDebugEnable,
  exchangeSitesJsonUrl: Constants?.manifest?.extra?.exchangeSitesJsonUrl
};

const getChannelConfig = () => {
  return devConfig;
};

const config: config.Config = {
  ...getChannelConfig()
};

export default config;
