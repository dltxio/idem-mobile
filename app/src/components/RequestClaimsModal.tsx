import * as React from "react";
import { Alert, AlertButton } from "react-native";
import axios from "axios";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimRequest } from "../types/claim";
import {
  generateClaimRequestResponsePayload,
  getClaimsFromTypes
} from "../utils/claim-utils";

type Props = {
  claimRequest: ClaimRequest | undefined;
  onClose: () => void;
};

const RequestClaimsModal: React.FC<Props> = ({ claimRequest, onClose }) => {
  const { usersClaims } = useClaimsStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const onCloseInternal = () => {
    setIsOpen(false);
    onClose();
  };

  React.useEffect(() => {
    if (!claimRequest || isOpen) {
      return;
    }

    setIsOpen(true);

    const claims = getClaimsFromTypes(claimRequest.claims).map((claim) => ({
      ...claim,
      value: usersClaims.find((userClaim) => userClaim.key === claim.key)?.value
    }));

    const unClaimedClaims = claims.filter((c) => !c.value);

    const alertTitle = `${claimRequest.host} is requesting your claims`;

    const alertContent = !unClaimedClaims.length
      ? `Tap "OK" to share ${claims.map((c) => c.title).join(", ")}`
      : `Unable to complete request. You have not provided the following claims: ${unClaimedClaims
          .map((c) => c.title)
          .join(", ")}`;

    const sendClaims = async () => {
      const body = generateClaimRequestResponsePayload(claims);

      try {
        await axios.post(claimRequest.callback, body);
        onCloseInternal();
      } catch (error) {
        const err = error as any;
        console.error(err?.response?.data || error);
      }
    };

    const buttons: AlertButton[] = [
      {
        text: !unClaimedClaims.length ? "Cancel" : "OK",
        onPress: onCloseInternal,
        style: "cancel"
      }
    ];

    if (!unClaimedClaims.length) {
      buttons.push({ text: "OK", onPress: sendClaims });
    }

    Alert.alert(alertTitle, alertContent, buttons);
  }, [claimRequest]);

  return null;
};

export default RequestClaimsModal;
