export const reformatDate = (date: string) => {
  if (date) {
    const dateArray = date.split("");
    const day = Number(dateArray.slice(0, 2).join(""));
    const month = dateArray.slice(3, 5).join("");
    const year = Number(dateArray.slice(6, 10).join(""));
    return `${year}${month}${day}`;
  }
};
