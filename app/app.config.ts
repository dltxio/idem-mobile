import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
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
