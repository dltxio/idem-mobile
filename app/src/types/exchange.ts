export type Exchange = {
  gpibUserID: string | undefined;
};

export type VerifyUserRequestBody = {
  userName: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  yob: string | undefined;
};

export type signUpUserRequestBody = {
  firstName: string | undefined;
  lastName: string | undefined;
  yob: string | undefined;
  mobile: string | undefined;
  extraIdNumber: null;
  action: null;
  version: null;
  siteVersion: null;
};
