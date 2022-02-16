import { createTheme } from "@mui/material/styles";
import { deepPurple, amber } from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: deepPurple,
    secondary: amber,
  },
});

export default lightTheme;
