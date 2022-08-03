import {
  RequestOtpRequest,
  UserDetailRequest,
  verifyPGPRequest
} from "./../src/types/user";
import {
  PutExpoTokenRequest,
  UserSignup,
  UserVerifyRequest,
  VerificationResponse
} from "../src/types/user";
import HTTPClient from "./HTTPClient";
import { RequestOptResponse, VerifyOtpRequest } from "../src/types/claim";
import { UploadPGPKeyResponse } from "../src/types/general";
export default class Api extends HTTPClient {
  public vendorSignup = async (body: UserSignup) =>
    this.post<string>(`user/signup`, body);

  public verify = async (body: UserVerifyRequest) =>
    this.post<IdemVerification>(`user/verify`, body);

  public putExpoToken = async (userId: string, body: PutExpoTokenRequest) => {
    this.put(`user/${userId}/token`, body);
  };

  public syncDetail = async (body: UserDetailRequest) =>
    this.post(`user/syncDetail`, body);

  public publishPGPKey = async (body: string) =>
    this.post<UploadPGPKeyResponse>(
      "https://keys.openpgp.org/vks/v1/upload",
      {
        keytext: body
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  public verifyPGPKey = async (body: verifyPGPRequest) =>
    this.post<string>(
      "https://keys.openpgp.org/vks/v1/request-verify",
      {
        token: body.token,
        addresses: body.addresses
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  public requestOtp = async (body: RequestOtpRequest) =>
    this.post<RequestOptResponse>(`user/requestOtp`, body);

  public verifyOtp = async (body: VerifyOtpRequest) =>
    this.post<boolean>(`user/verifyOtp`, body);
}
