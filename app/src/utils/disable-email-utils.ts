import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert } from "react-native";
import { useClaimValue } from "../context/ClaimsStore";
import usePgp from "../hooks/usePpg";
import { ClaimData } from "../types/claim";

const disableEmailButton = async (claims: ClaimData[] | null) => {
  claims?.map((claim) => {
    const findEmail = claims.find((c) => c.type === "EmailCredential");
    if (claim.type === "EmailCredential") {
      
    }
  });
};
export default disableEmailButton;
