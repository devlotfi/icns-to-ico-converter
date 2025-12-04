import { heroui } from "@heroui/react";

export default heroui({
  addCommonColors: true,
  themes: {
    light: {
      layout: {
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
      },
      colors: {
        content2: "#E1E9EF",
        content3: "#fff",
        foreground: "#536777",
        background: {
          foreground: "#536777",
        },
        divider: "#d5dde7",
        default: {
          foreground: "#536777",
          DEFAULT: "#D2D4DA",
          "50": "#FAFAFA",
          "100": "#F4F4F6",
          "200": "#E3E4E9",
          "300": "#D2D4DA",
          "400": "#9DA1AF",
          "500": "#6D717F",
          "600": "#4E5260",
          "700": "#3C3F4A",
          "800": "#26272C",
          "900": "#17181D",
        },
        success: {
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#4267dd",
          50: "#e4eeff",
          100: "#bccbf8",
          200: "#92a8ef",
          300: "#6785e5",
          400: "#3c63dc",
          500: "#2349c3",
          600: "#193998",
          700: "#0f296e",
          800: "#071845",
          900: "#00081d",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      layout: {
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
      },
      colors: {
        content1: "#212A3A",
        content2: "#1D232D",
        content3: "#1A2131",
        background: {
          DEFAULT: "#212A3A",
        },
        divider: "#424d63",
        default: {
          DEFAULT: "#414C64",
          "50": "#17181D",
          "100": "#26272C",
          "200": "#414556",
          "300": "#4E5260",
          "400": "#6D717F",
          "500": "#9DA1AF",
          "600": "#D2D4DA",
          "700": "#E3E4E9",
          "800": "#F4F4F6",
          "900": "#FAFAFA",
        },
        success: {
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#4267dd",
          50: "#e4eeff",
          100: "#bccbf8",
          200: "#92a8ef",
          300: "#6785e5",
          400: "#3c63dc",
          500: "#2349c3",
          600: "#193998",
          700: "#0f296e",
          800: "#071845",
          900: "#00081d",
          foreground: "#ffffff",
        },
      },
    },
  },
});
