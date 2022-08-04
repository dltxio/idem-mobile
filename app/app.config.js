export default ({ config }) => {
  return {
    ...config,
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
