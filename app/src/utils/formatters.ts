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

export const reformatDate = (date: string) => {
  if (date) {
    const dateArray = date.split("");
    const day = Number(dateArray.slice(0, 2).join(""));
    const month = dateArray.slice(3, 5).join("");
    const year = Number(dateArray.slice(6, 10).join(""));
    return `${year}${month}${day}`;
  }
};
