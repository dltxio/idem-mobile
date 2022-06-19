import moment from "moment";

export const findYOB = (dob: string) => {
  return moment(dob, "DD/MM/YYYY").year();
};

export const findNames = (fullname: string | undefined) => {
  if (fullname) {
    const fullNameArray = fullname.split(" ");
    const lastIndex = fullNameArray.lastIndexOf("");
    const firstName = fullNameArray.slice(0, 1).join("");
    const lastName = fullNameArray.slice(lastIndex).join("");
    return { firstName, lastName };
  }
  return null;
};
