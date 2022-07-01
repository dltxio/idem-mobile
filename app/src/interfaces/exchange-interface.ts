export interface IExchange {
  signUp: (name: string, email: string) => Promise<void>;
}

export interface EasyExchange {
  signUpEc: (body: stuff) => Promise<void>;
}

export type VerificationResponse = {
  result: KycResult;
  userId: string;
  thirdPartyVerified: boolean;
};

export enum KycResult {
  InProgress = "in_progress",
  Completed = "completed",
  Failed = "failed"
}
//CHANGE THE NAME BEFORE U COMMIT
export type stuff = {
  mobile: string;
  yob: string;
  lastName: string;
  email: string;
  firstName: string;
  extraIdNumber: null;
  action: null;
  version: null;
  siteVersion: null;
};
