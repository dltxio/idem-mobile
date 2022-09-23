declare module "@env" {
  export const API_URL: string;
}

declare namespace config {
  type Config = {
    releaseChannel?: string;
    apiEndpoint: string;
    userName?: string;
    password?: string;
    sentryDSN: string;
    sentryDebugEnable: boolean;
    exchangeSitesJsonUrl: string;
  };
}
