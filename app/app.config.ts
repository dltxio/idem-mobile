import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    extra: {
      apiEndpoint: process.env.API_ENDPOINT ?? "https://proxy.idem.com.au/",
      userName: process.env.PROXY_USERNAME ?? "idem",
      password: process.env.PROXY_PASSWORD ?? "idem",
      sentryDSN:
        process.env.SENTRY_DSN ??
        "https://6965f2d7058b49e9a642b8d60f704eb1@o1345931.ingest.sentry.io/6623100",
      SENTRY_DEBUG_ENABLE: true,
      partnersUrl:
        process.env.EXCHANGE_JSON_URL ??
        "https://raw.githubusercontent.com/dltxio/idem-mobile/development/data/sites.json",
      eas: {
        projectId: "574370e2-908d-4881-ae61-0453066c1e8a"
      }
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
