import {
  RequestOtpRequest,
  SignupResponse,
  uploadPublicKey,
  UserDto,
  UsersResponse
} from "./../src/types/user";
import {
  UserSignup,
  UserVerifyRequest,
  IdemVerification
} from "../src/types/user";
import HTTPClient from "./HTTPClient";
import { RequestOptResponse, VerifyOtpRequest } from "../src/types/claim";

export default class Api extends HTTPClient {
  public vendorSignup = async (
    body: UserSignup,
    verification: IdemVerification
  ) => {
    const payload = {
      ...body,
      verification
    };
    return this.post<SignupResponse>(`exchanges/signup`, payload);
  };

  public verifyClaims = async (body: UserVerifyRequest) =>
    this.post<IdemVerification>(`users/verify`, body);

  public putUser = async (email: string, body: UserDto) => {
    this.put(`users/${email}`, body);
  };

  public requestOtp = async (body: RequestOtpRequest) =>
    this.post<RequestOptResponse>(`otp/request`, body);

  public verifyOtp = async (body: VerifyOtpRequest) =>
    this.post<boolean>(`otp/verify`, body);

  public uploadPublicKey = async (body: uploadPublicKey) =>
    this.post<boolean>(`users/create`, body);

  public getUser = async (email: string) =>
    this.get<UsersResponse>(`users/${email}`);
}
