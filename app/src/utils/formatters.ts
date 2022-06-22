export const findYOB = (dob: string) => {
  const dobArray = dob.split("");
  const findYob = dobArray.slice(6, 10);
  const yob = findYob.join("");
  return yob;
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

// export const findAddress = (address: string | undefined) => {
//   if (address) {
// const fullAddressArray = address(" ");
// const country = fullAddressArray.join();
// const houseNumber = fullAddressArray.join();
// const postCode = fullAddressArray.join();
// const state = fullAddressArray.join();
// const street = fullAddressArray.join();
// const suburb = fullAddressArray.join();
//     return { fullAddressArray };
//   }
//   return null;
// };
