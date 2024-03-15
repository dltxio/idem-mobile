import useApi from "./useApi";
import { UserVerifyRequest } from "../types/user";
import { verificationStorage } from "../utils/local-storage";
import { useClaimsStore } from "../context/ClaimsStore";

type Hooks = {
  verifyClaims: (
    verifyRequest: UserVerifyRequest,
    expoToken: string | undefined
  ) => Promise<VerifyClaimResponse>;
};

type VerifyClaimResponse = {
  success: boolean;
  message?: string;
};

const useVerifyClaims = (): Hooks => {
  const api = useApi();
  const { updateClaim } = useClaimsStore();
  const verifyClaims = async (
    verifyRequest: UserVerifyRequest,
    expoToken: string | undefined
  ): Promise<VerifyClaimResponse> => {
    return api
      .verifyClaims(verifyRequest)
      .then(async (response) => {
        await verificationStorage.save(response);
        response.JWTs.forEach((proof) => {
          updateClaim(proof.claimType, undefined, undefined, true, proof.jwt);
        });
        if (expoToken) {
          await api.putUser(verifyRequest.hashEmail, {
            email: verifyRequest.hashEmail,
            expoToken: expoToken
          });
        }
      })
      .then(() => {
        return { success: true };
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  };

  return {
    verifyClaims
  };
};

export default useVerifyClaims;
