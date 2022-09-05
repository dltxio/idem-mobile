import React from "react";
import { ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { ProfileStackNavigationRoute } from "../types/navigation";
import { getClaimFromType } from "../utils/claim-utils";
import { pgpLocalStorage } from "../utils/local-storage";
import { extractPrivateKeyFromContent } from "../utils/pgp-utils";
import usePgp from "./usePpg";

type Hooks = {
  generateAndPublishNewPgpKey: (blah: string | undefined) => Promise<void>;
  useEmailClaim: (blahh: string) => Promise<void>;
  loadKeyFromLocalStorage: (blah: string | undefined) => Promise<void>;
  extractAndLoadKeyPairFromContent: (blah: string | undefined) => Promise<void>;
};

const useEmailClaim = (): Hooks => {
  const [emailInput, setEmailInput] = React.useState(true);
  const { generateKeyPair, generateKeyPairFromPrivateKey, verifyPublicKey } =
    usePgp();
      const claim = getClaimFromType(route.params.claimType);
  const [keyText, setKeyText] = React.useState<string>();
    const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const { addClaim, usersClaims } = useClaimsStore();
  const userClaim = usersClaims.find((c) => c.type === claim.type);
  const emailClaim = usersClaims.find(
    (c) => c.type === ClaimTypeConstants.EmailCredential
  );

  const generateAndPublishNewPgpKey = React.useCallback(
    async (name: string, email: string) => {
      await generateKeyPair(name, email);
      await loadKeyFromLocalStorage();
      const key = await pgpLocalStorage.get();
      if (!key) return;
    },
    [generateKeyPair]
  );

  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setKeyText(key.publicKey);
  }, [setKeyText]);

  const extractAndLoadKeyPairFromContent = React.useCallback(
    async (content: string) => {
      const privateKey = extractPrivateKeyFromContent(content);
      // await generateKeyPairFromPrivateKey(privateKey);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPairFromPrivateKey, loadKeyFromLocalStorage]
  );

  return {
    useEmailClaim,
    generateAndPublishNewPgpKey,
    loadKeyFromLocalStorage,
    extractAndLoadKeyPairFromContent
  };
};

export default useEmailClaim;
