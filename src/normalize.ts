import { toPrecision } from "./precision";

export const normalize = (
  value: number,
  minFrom: number,
  maxFrom: number,
  minTo: number = 0,
  maxTo: number = 1,
  precision?: number = 3
): number => {
  // Ensure the value is within the source range
  const clampedValue = Math.min(maxFrom, Math.max(minFrom, value));

  // Calculate the normalized value in the target range
  const normalizedValue =
    ((clampedValue - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;

  return toPrecision(normalizedValue, precision);
};
