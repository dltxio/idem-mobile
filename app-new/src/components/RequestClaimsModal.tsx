import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import { useClaimsStore } from "../context/ClaimsStore";
import { Claim, ClaimRequest } from "../types/claim";
import Modal from "./Modal";
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
  const [loading, setLoading] = React.useState<boolean>();
  const [success, setSuccess] = React.useState(false);

  const claims =
    claimRequest?.claims &&
    getClaimsFromTypes(claimRequest.claims).map(claim => ({
      ...claim,
      value: usersClaims.find(userClaim => userClaim.key === claim.key)?.value
    }));

  const unClaimedClaims = claims?.filter(c => !c.value);

  const onConfirm = async () => {
    if (!claimRequest?.callback) {
      return;
    }

    const claimsToPost = usersClaims.filter((claim: Claim) =>
      claimRequest.claims.includes(claim.type)
    );

    const body = generateClaimRequestResponsePayload(claimsToPost);

    try {
      setLoading(true);
      await axios.post(claimRequest.callback, body);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const content = claimRequest && claims && unClaimedClaims && (
    <>
      <Text>{claimRequest.host} has requested the following claims:</Text>
      <ClaimList claims={claims} />
      {unClaimedClaims.length ? (
        <Text style={styles.cantProceedText}>
          Unable to complete this request because you dont have the following
          claims: {unClaimedClaims.map(c => c.title).join(", ")}
        </Text>
      ) : null}
      {!unClaimedClaims.length && success !== true && (
        <Button
          title="Confirm"
          onPress={onConfirm}
          style={styles.confirmButton}
          loading={loading}
        />
      )}
    </>
  );

  return (
    <Modal title="Request for claims" show={!!claimRequest} onClose={onClose}>
      {content}
    </Modal>
  );
};

export default RequestClaimsModal;

const ClaimList: React.FC<{
  claims: (Omit<Claim, "value"> & { value?: string })[];
}> = ({ claims }) => {
  return (
    <View style={styles.claimList}>
      {claims.map(c => {
        const claimText = c.value ? `${c.title}: ${c.value}` : c.title;

        return (
          <View key={c.key}>
            <Text>{claimText}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  claimList: {
    marginTop: 10
  },
  cantProceedText: {
    marginTop: 10
  },
  confirmButton: {
    marginTop: 20
  }
});
