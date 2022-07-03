import * as password from "secure-random-password";

export const createRandomPassword = (length = 10) => {
  return password.randomPassword({
    length: length,
    characters: [password.lower, password.upper, password.digits]
  });
};
