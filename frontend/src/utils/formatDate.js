export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateBrazil = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const formatToDateOnly = (inputDate) => {
  if (!inputDate) return null;

  const date = new Date(inputDate);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isDateWithinDaysRange = (isoDate, days) => {
  const inputDate = new Date(isoDate);
  const today = new Date();

  const limitDate = new Date(inputDate);
  limitDate.setDate(inputDate.getDate() - days);

  return today <= limitDate;
};
