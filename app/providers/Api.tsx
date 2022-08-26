import React, { createContext } from "react";
import Api from "../apis/Api";
import appConfig from "../config";

export const ApiContext = createContext<Api>(null as unknown as Api);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const api = new Api(appConfig.apiEndpoint, true);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
