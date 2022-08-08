import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants?.manifest?.releaseChannel as
  | string
  | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/", // change to localhost if running locally for example "http://192.168.1.117:3000/",
  userName: "<USERNAME>",
  password: "<PASSWORD>",
  sentryDSN:
    "https://6965f2d7058b49e9a642b8d60f704eb1@o1345931.ingest.sentry.io/6623100",
  sentryDebugEnable: true
};

const stagingConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/",
  userName: process.env.STAGING_PROXY_USERNAME,
  password: process.env.STAGING_PROXY_PASSWORD,
  sentryDSN:
    "https://6965f2d7058b49e9a642b8d60f704eb1@o1345931.ingest.sentry.io/6623100",
  sentryDebugEnable: true
};

const productionConfig: config.Config = {
  apiEndpoint: "https://uat-proxy.idem.com.au/",
  userName: process.env.PROD_PROXY_USERNAME,
  password: process.env.PROD_PROXY_PASSWORD,
  sentryDSN:
    "https://6965f2d7058b49e9a642b8d60f704eb1@o1345931.ingest.sentry.io/6623100",
  sentryDebugEnable: false
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
  ...getChannelConfig(),
  releaseChannel
};

export default appConfig;
