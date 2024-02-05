export const toPrecision = (number: number, precision: number = 3): number => {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};
