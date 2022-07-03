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

export type VerifyEmail = {
  token: string | undefined;
  addresses: string[];
};

export type UploadPGPKeyResponse = {
  token: string;
};
