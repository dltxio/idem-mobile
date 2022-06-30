import React from "react";
import { ApiContext } from "../../providers/Api";
import Api from "../../apis/Api";

const useApi = (): Api => {
  return React.useContext(ApiContext);
};

export default useApi;
