import { UserSignup } from "../src/types/user";
import HTTPClient from "./HTTPClient";
export default class Api extends HTTPClient {
  public gpibSignup = async (body: UserSignup) =>
    this.post<string>(`user/signup`, body);
}
