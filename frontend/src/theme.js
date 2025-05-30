// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  colors: {
    brand: {
      50: "#e3f9e5",
      100: "#c1eac5",
      200: "#a3d9a5",
      300: "#7bc47f",
      400: "#57ae5b",
      500: "#3f9142", // Main green
      600: "#2f8132",
      700: "#207227",
      800: "#0e5814",
      900: "#05400a",
    },
  },
});

export default theme;
