import React, { useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "styled-components";
import Theme from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { loadRefreshFromLocalStorage } from "./helpers/localStorageHelpers";
import { fetchProfile } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const refreshToken = loadRefreshFromLocalStorage();

    // Si tenemos un token guardado Y AÚN NO tenemos un usuario en Redux...
    if (refreshToken && !currentUser) {
      // ...dispara el fetchProfile (que usará el interceptor)
      dispatch(fetchProfile());
    }
  }, [dispatch, currentUser]);

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
