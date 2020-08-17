const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export default {
  colors: {
    accent: '#05f',
    accentLight: '#F3C1B9',
    successLight: '#D2F3B9',
    success: '#50B83C',
    danger: '#e74c3c',
    warning: '#F9CA24',
    white: '#ffffff',
    lightBeige: '#f4f0eb',
    orange: '#f78745',
    onboarding: '#6ab04c',
    offboarding: '#f78745',
    manager: '#686DE0',
    turqoise: '#3dc1d3',
    lightGrey: '#ecedf2',
    darkGrey: '#dde0e6',
    text: {
      accent: '#05f',
      primary: '#0d1a26',
      lighter: '#6b7790',
      light: '#788995',
    },
    bg: {
      foreground: '#FFFFFF',
      background: '#f7f8fa',
      boxed: '#eceff3',
      accent: '#05f',
      lightAccent: '#0055ff1a',
      beige: '#F4F0EB',
      darkGrey: '#ebeff3',
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    default: "'Roboto', sans-serif",
  },
  /*
    0 - 0
    1 - 12
    2 - 14
    3 - 16
    4 - 18
    5 - 20
    6 - 24
    7 - 32
    8 - 48
   */
  fontSizes: [0, 12, 14, 16, 18, 20, 24, 32, 48],
  lineHeights: ['0px', '16px', '18px', '26px', '28px', '32px', '40px'],
  borders: {
    light: '1px solid #ecedf2',
    dark: '1px solid #dde0e6',
    black: '1px solid #0d1a26',
    accent: '1px solid #05f',
    error: '1px solid #e74c3c',
    transparent: '1px solid transparent',
  },
  /*
    0 - 3
    1 - 6
    2 - 12
    3 - 999
   */
  radii: [3, 6, 12, 999],
  /*
    0 - 0
    1 - 4
    2 - 8
    3 - 12
    4 - 16
    5 - 24
    6 - 32
    7 - 48
    8 - 64
    9 - 72
   */
  space: [0, 4, 8, 12, 16, 24, 32, 48, 64, 72],
  /*
    0 - 0
    1 - 300
    2 - 400
    3 - 500
    4 - 600
    5 - 1200
    6 - 1400
    7 - 1600
  */
  sizes: [0, 300, 400, 500, 600, 1200, 1400, 1600],
  zIndices: {
    top: 999,
    bottom: 0,
  },
  shadows: {
    main: '0 3px 8px 0 rgba(0, 0, 0, 0.25);',
    active: '0px 0px 5px rgba(0, 0, 0, 0.15), 1px 4px 4px rgba(0, 0, 0, 0.15);',
    image: '0px 4px 25px rgba(0, 0, 0, 0.25);',
    hover: 'box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.25);',
  },
  transitions: {
    default: '0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
  },
};
