import React from "react";
import { ClaimContext, ClaimContextType } from "../providers/Claim";

const useClaims = (): ClaimContextType => {
  return React.useContext(ClaimContext) as ClaimContextType;
};

export default useClaims;
