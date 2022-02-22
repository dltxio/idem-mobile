import config from "../../config.dev.json";
import { post } from "../http";
import { IClaimPresentation, IClaimRequest } from "../../helpers/interfaces";

export const sendOnboarding = async (body: IClaimRequest) => {
    const endpoint = `${config.onboard.endpoint}?challenge=${body.challenge}&claims=EmailCredential,NameCredential`;
    return post<IClaimPresentation>(endpoint, body);
    //return post<IClaimPresentation>(endpoint, {});
}

export const verifyClaim = async (body: IClaimPresentation) => {};
