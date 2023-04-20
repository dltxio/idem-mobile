import {
  ExchangeSignupRequest,
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
    verification: IdemVerification | undefined
  ) => {
    const payload: ExchangeSignupRequest = {
      ...body,
      verification
    };
    return this.post<SignupResponse>(`exchanges/signup`, payload);
  };

  public verifyClaims = async (body: UserVerifyRequest) =>
    this.post<IdemVerification>(`users/verify-claims`, body);

  public putUser = async (email: string, body: UserDto) => {
    this.put(`users/${email}`, body);
  };

  public resendVerificationEmail = async (body: { hashedEmail: string }) =>
    this.post<boolean>(`users/resend-email`, body);

  public requestOtp = async (body: RequestOtpRequest) =>
    this.get<RequestOptResponse>(`otp/request/${body.mobileNumber}`);

  public verifyOtp = async (body: VerifyOtpRequest) =>
    this.post<boolean>(`otp/verify`, body);

  public uploadPublicKey = async (body: uploadPublicKey) =>
    this.post<boolean>(`users/create`, body);

  public createUser = async (body: UserDto) => this.post(`users/create`, body);

  public getUser = async (email: string) =>
    this.get<UsersResponse>(`users/${email}`);
}
