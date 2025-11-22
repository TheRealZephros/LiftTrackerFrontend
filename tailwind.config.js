/** @type {import('tailwindcss').Config} */
const { text } = require('node:stream/consumers');
const colors = require("tailwindcss/colors");

const BG1 = colors.gray["900"];
const BG2 = colors.gray["800"];
const BG3 = colors.gray["700"];
const BG4 = colors.gray["600"];
const BUTTON_DELETE1 = colors.red["400"];
const BUTTON_DELETE2 = colors.red["500"];
const BUTTON_EDIT1 = colors.blue["400"];
const BUTTON_EDIT2 = colors.blue["500"];
const BUTTON1 = colors.yellow["500"];
const BUTTON2 = colors.yellow["600"];
const PRIMARY1 = colors.yellow["500"];
const PRIMARY2 = colors.yellow["600"];
const SYSTEM_MADE_BG = colors.blue["700"];
const SYSTEM_MADE_TEXT = colors.blue["300"];
const TEXT1 = colors.white;
const TEXT2 = colors.yellow["400"];
const TEXT3 = colors.gray["400"];
const USER_MADE_BG = colors.green["700"];
const USER_MADE_TEXT = colors.green["300"];

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1020px",
      xl: "1440px",
    },
    extend: {
      colors: {
        bg1: BG1,
        bg2: BG2,
        bg3: BG3,
        bg4: BG4,
        button1: BUTTON1,
        button2: BUTTON2,
        buttonDelete1: BUTTON_DELETE1,
        buttonDelete2: BUTTON_DELETE2,
        buttonEdit1: BUTTON_EDIT1,
        buttonEdit2: BUTTON_EDIT2,
        primary1: PRIMARY1,
        primary2: PRIMARY2,
        systemMadeBg: SYSTEM_MADE_BG,
        systemMadeText: SYSTEM_MADE_TEXT,
        text1: TEXT1,
        text2: TEXT2,
        text3: TEXT3,
        userMadeBg: USER_MADE_BG,
        userMadeText: USER_MADE_TEXT,
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      spacing: {
        180: "32rem",
      },
    },
  },
  plugins: [],
};