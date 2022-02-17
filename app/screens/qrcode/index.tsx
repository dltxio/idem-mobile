import React from "react";
import { IClaim } from "../../store/assetStore";
import SvgQRCode from 'react-native-qrcode-svg';
import { observer } from "mobx-react-lite";

const Qrcode : React.FC<{claim: IClaim}> = ({ claim }) => {
  return (
    <SvgQRCode value={`https://google.com/${claim.value}`} />
  );
};

export default observer(Qrcode);
