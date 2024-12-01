module.exports = round = (number, decimalPlaces = 2) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((number + Number.EPSILON) * factor) / factor;
};
