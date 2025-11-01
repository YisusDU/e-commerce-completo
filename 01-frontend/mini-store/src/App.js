import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "styled-components";
import Theme from "./styles";

function App() {
  return (
    <div>
      <ThemeProvider theme={Theme}>
        <GlobalStyles />
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;
