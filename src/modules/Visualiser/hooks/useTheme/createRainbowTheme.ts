/**
 * Generates an array of RGB color strings representing a rainbow gradient.
 * @param n - The number of colors to generate. Higher values result in a smoother gradient.
 * @returns An array of RGB color strings in the format "rgb(R, G, B)".
 */
export const generateRainbowGradient = (n: number): string[] => {
  if (n < 1) {
    return []
  }

  const colors: string[] = []

  for (let i = 0; i < n; i++) {
    const hue = (i / (n - 1)) * 360 // Spread across the hue spectrum (0-360)
    const rgb = hslToRgb(hue, 100, 50)
    colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
  }

  return colors
}

/**
 * Converts HSL to RGB.
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns An array [R, G, B] with values between 0 and 255.
 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255)

  return [f(0), f(8), f(4)]
}