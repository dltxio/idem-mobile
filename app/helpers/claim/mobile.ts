import config from "../../config.dev.json";
import { put, post } from "../http";

export const sendMobileCode = async (
  body: server.RequestPhoneVerificationSMSRequestBody,
) => await put(`${config.mobile.endpoint}`, body);

export const verifyMobileCode = async (body: server.VerifyPhoneRequestBody) =>
  await post(`${config.mobile.endpoint}`, body);
