export const stringToDate = (date: string) => {
  const dateArray = date.split("/");
  const day = Number(dateArray.slice(0, 1).join(""));
  const month = Number(dateArray.slice(1, 2).join(""));
  const year = Number(dateArray.slice(2, 3).join(""));
  const formattedDate = new Date(year, month, day).getTime();
  return formattedDate;
};
