export const map = (
  value: number,
  min: number,
  max: number,
  dMin: number,
  dMax: number,
  clampValue: boolean = false
): number =>
  (((clampValue ? clamp(value, min, max) : value) - min) / (max - min)) *
    (dMax - dMin) +
  dMin;

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const snapToClosest = (
  value: number,
  gap: number,
  min?: number
): number => Math.round((value - min) / gap) * gap + min;

export const RadToDeg = 180 / Math.PI;
export const DegToRad = Math.PI / 180;
