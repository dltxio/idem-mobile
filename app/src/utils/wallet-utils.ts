export const truncateAddress = (address: string) => {
  const addressArray = address.split("");
  const firstDigits = addressArray.slice(0, 6);
  const lastIndex = addressArray.lastIndexOf("");
  const lastDigits = addressArray.slice(lastIndex - 6, lastIndex);
  return firstDigits.join("") + "..." + lastDigits.join("");
};
