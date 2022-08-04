declare module "@env" {
  export const API_URL: string;
}

declare namespace config {
  type Config = {
    apiEndpoint: string;
    userName?: string;
    password?: string;
  };
}
