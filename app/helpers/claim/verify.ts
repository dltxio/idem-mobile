import config from "../../config.dev.json";
import { post } from "../http";

export const sendOnboarding = async (body: server.ClaimRequest) =>
  post<server.Claim[]>(`${config.onboard.endpoint}/verify`, body);

export const verifyClaim = async (body: server.Claim) => {};
