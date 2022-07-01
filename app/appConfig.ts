import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants?.manifest?.releaseChannel as
  | string
  | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint: "http://10.5.20.34:3000/", // change to localhost if running locally for example "http://192.168.1.117:3000/",
  userName: "myusername",
  password: "password123"
};

const stagingConfig: config.Config = {
  apiEndpoint: "https://proxy.idem.com.au/",
  userName: "myusername",
  password: "password123"
};

const productionConfig: config.Config = {
  apiEndpoint: "https://proxy.idem.com.au/",
  userName: "myusername",
  password: "password123"
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
