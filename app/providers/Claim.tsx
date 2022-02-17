import React, { createContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ClaimContextType = {
  claims: server.Claim[];
  selectedClaim: server.Claim | undefined;
  isLoading: boolean;
  fetchClaims: () => void;
  setClaim: (key: string, value: any) => void;
  setSelectedClaim: (claim: server.Claim) => void;
};

export const ClaimContext = createContext<ClaimContextType>(null as any);

export const ClaimProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [claims, setClaims] = useState<server.Claim[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<server.Claim | undefined>(undefined);

  const fetchClaims = useCallback(async () => {
    const claimsLocal = await AsyncStorage.getItem("claims");
    if (claimsLocal) {
      setClaims(JSON.parse(claimsLocal));
    }
    setLoading(false);
  }, []);

  const setClaim = async (key: string, value: any) => {
    const claim = claims.find(c => c.key === key);
    if (claim) {
      claim.credentialSubject.value = value;
    }
    setClaims(claims);
    await AsyncStorage.setItem("claims", JSON.stringify(claims));
  };

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <ClaimContext.Provider value={{ claims, selectedClaim, isLoading, fetchClaims, setClaim, setSelectedClaim }}>
      {children}
    </ClaimContext.Provider>
  );
};
