import {UserDetailRequest, verifyPGPRequest } from "./../src/types/user";
import {
  PutExpoTokenRequest,
  UserSignup,
  UserVerifyRequest,
  VerificationResponse
} from "../src/types/user";
import HTTPClient from "./HTTPClient";
export default class Api extends HTTPClient {
  public vendorSignup = async (body: UserSignup) =>
    this.post<string>(`user/signup`, body);

  public verify = async (body: UserVerifyRequest) =>
    this.post<VerificationResponse>(`user/verify`, body);

  public putExpoToken = async (userId: string, body: PutExpoTokenRequest) => {
    this.put(`user/${userId}/token`, body);
  };

  public syncDetail = async (body: UserDetailRequest) =>
    this.post(`user/syncDetail`, body);

  public publishPGPKey = async (body: string) =>
    this.post<any>(
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
    this.post<any>(
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
}
