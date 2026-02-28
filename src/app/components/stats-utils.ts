// Normal distribution utility functions

// Error function approximation (Abramowitz and Stegun)
export function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

// Standard normal CDF: P(Z <= z)
export function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Standard normal PDF
export function normalPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

// Inverse normal CDF (approximation using rational approximation)
export function inverseNormalCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  // Rational approximation for central region
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q, r;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

// Generate normal distribution curve data points
export function generateNormalCurveData(
  mean: number = 0,
  sd: number = 1,
  points: number = 200
): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = [];
  const minX = mean - 4 * sd;
  const maxX = mean + 4 * sd;
  const step = (maxX - minX) / points;

  for (let i = 0; i <= points; i++) {
    const x = minX + i * step;
    const z = (x - mean) / sd;
    const y = normalPDF(z) / sd;
    data.push({ x: parseFloat(x.toFixed(6)), y });
  }
  return data;
}

// Generate standard normal curve data
export function generateStdNormalData(points: number = 200): { x: number; y: number; yLeft?: number; yRight?: number; yBetween?: number }[] {
  const data: { x: number; y: number }[] = [];
  const step = 8 / points;

  for (let i = 0; i <= points; i++) {
    const x = -4 + i * step;
    const y = normalPDF(x);
    data.push({ x: parseFloat(x.toFixed(4)), y });
  }
  return data;
}

// Round to 10 decimal places, trimming trailing zeros
export function fmt(value: number): string {
  return value.toFixed(10).replace(/\.?0+$/, "");
}