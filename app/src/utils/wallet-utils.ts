export const truncateAddress = (address: string) => {
  const firstDigits = address.substring(0, 12);
  const lastDigits = address.substring(address.length - 12, address.length);
  return `${firstDigits}...${lastDigits}`;
};
