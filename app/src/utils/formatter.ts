export const reformatDate = (date: string) => {
  const dateArray = date.split("");
  const day = Number(dateArray.slice(0, 2).join(""));
  let month = dateArray.slice(3, 5).join("");
  const year = Number(dateArray.slice(6, 10).join(""));
  if (Number(month) < 10) {
    month = `0${Number(month)}`;
  }
  return `${year}${month}${day}`;
};
