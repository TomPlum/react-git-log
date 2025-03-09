export interface ThemeColours {
  hoverColour: string
  textColour: string
}

export type Theme = 'dark' | 'light'

export const darkThemeColors = [
  'rgb(33, 150, 243)',  // Bright blue
  'rgb(25, 118, 210)',  // Deep blue
  'rgb(21, 101, 192)',  // Darker blue
  'rgb(98, 0, 234)',    // Vivid purple
  'rgb(123, 31, 162)',  // Deep purple
  'rgb(94, 53, 177)',   // Muted purple
  'rgb(0, 230, 118)',   // Neon green
  'rgb(0, 200, 83)',    // Darker neon green
  'rgb(46, 125, 50)',   // Forest green
  'rgb(0, 77, 64)'      // Teal green
]

export const lightThemeColors = [
  'rgb(100, 181, 246)', // Light blue
  'rgb(66, 165, 245)',  // Sky blue
  'rgb(41, 182, 246)',  // Bright cyan-blue
  'rgb(186, 104, 200)', // Soft purple
  'rgb(156, 39, 176)',  // Vibrant purple
  'rgb(171, 71, 188)',  // Medium purple
  'rgb(102, 187, 106)', // Fresh green
  'rgb(67, 160, 71)',   // Leaf green
  'rgb(129, 199, 132)', // Pastel green
  'rgb(77, 182, 172)'   // Soft teal
]