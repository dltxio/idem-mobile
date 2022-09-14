import moment from "moment";

export const findYOB = (dob: string) => {
  const _dob = moment(dob, "DD/MM/YYYY");
  return _dob.year().toString();
};

export const findNames = (fullname: string | undefined) => {
  if (fullname) {
    const fullNameArray = fullname.split(" ");
    const lastIndex = fullNameArray.lastIndexOf("");
    const firstName = fullNameArray.slice(0, 1).join("");
    const middleName = fullNameArray.slice(1, lastIndex).join(" ");
    const lastName = fullNameArray.slice(lastIndex).join("");
    return { firstName, middleName, lastName };
  }
  return null;
};
