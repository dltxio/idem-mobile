export interface IExchange {
  signUp: (name: string, email: string) => Promise<void>;
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
  mobile: any;
  yob: any;
  lastName: any;
  firstName: any;
  bod: (
    firstName: string,
    lastName: string,
    yob: string,
    mobile: string,
    extraIdNumber: null,
    action: null,
    version: null,
    siteVersion: null
  ) => Promise<void>;
};
