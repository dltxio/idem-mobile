import config from "../../config.dev.json";
import { post } from "../http";
import { IClaimPresentation, IClaimRequest } from "../../helpers/interfaces";

export const sendOnboarding = async (body: IClaimRequest, nonce: string) => {
    console.log(`nonce: ${nonce}`);
    const endpoint = `${config.onboard.endpoint}?challenge=${nonce}&claims=EmailCredential,NameCredential`;
    console.log(`POSTing to ${endpoint}`)
    return post<IClaimPresentation>(endpoint, body);
}

export const verifyClaim = async (body: IClaimPresentation, nonce: string) => { };
