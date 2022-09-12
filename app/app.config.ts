import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    extra: {
      apiEndpoint: process.env.API_ENDPOINT ?? "https://uat-proxy.idem.com.au/",
      userName: process.env.PROXY_USERNAME ?? "<username>",
      password: process.env.PROXY_PASSWORD ?? "<password>",
      sentryDSN:
        process.env.SENTRY_DSN ??
        "https://6965f2d7058b49e9a642b8d60f704eb1@o1345931.ingest.sentry.io/6623100",
      SENTRY_DEBUG_ENABLE: true
    },
    ...(config as ExpoConfig),
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "dltx-50",
            project: "idem-mobile",
            authToken: process.env.SENTRY_AUTH_TOKEN
          }
        }
      ]
    }
  };
};
