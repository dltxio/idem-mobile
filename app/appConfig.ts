import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants?.manifest?.releaseChannel as
  | string
  | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/", // change to localhost if running locally for example "http://192.168.1.117:3000/",
  userName: "myusername",
  password: "password123"
};

const stagingConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/",
  userName: process.env.staging_proxyUsername,
  password: process.env.staging_proxyUsername
};

const productionConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/",
  userName: process.env.prod_proxyUsername,
  password: process.env.prod_proxyUsername
};

const getChannelConfig = () => {
  if (isEnvironment("staging")) {
    return stagingConfig;
  }

  if (isEnvironment("production")) {
    return productionConfig;
  }

  return devConfig;
};

const appConfig: config.Config = {
  ...getChannelConfig()
};

export default appConfig;
