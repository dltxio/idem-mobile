import * as password from "secure-random-password";

export const createRandomPassword = () => {
  return password.randomPassword({
    length: 10,
    characters: [password.lower, password.upper, password.digits]
  });
};
