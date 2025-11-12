import api from ".";
import {
  loadRefreshFromLocalStorage,
  saveRefreshToLocalStorage,
} from "../helpers/localStorageHelpers";
import { setAccessToken, logout } from "../redux/slices/userSlice";

const REFRESH_URL = "/account/api/token/refresh/";
const LOGIN_URL = "/account/api/token/";
const REGISTER_URL = "/account/register/";

const setupInterceptors = (store) => {
  // --- TRABAJO #1: INTERCEPTOR DE PETICIÓN (REQUEST) ---
  api.interceptors.request.use(
    (config) => {
      // No añadas el token a URLs de autenticación
      if (
        config.url === LOGIN_URL ||
        config.url === REGISTER_URL ||
        config.url === REFRESH_URL
      ) {
        return config;
      }

      // 5. Saca el token del estado de Redux
      const token = store.getState().user.accessToken;

      if (token) {
        // 6. ¡Lo adjunta!
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // --- TRABAJO #2: INTERCEPTOR DE RESPUESTA (RESPONSE) ---
  // (Aquí ocurre la magia)
  api.interceptors.response.use(
    // 7. Si la respuesta es 2xx (exitosa), déjala pasar.
    (res) => {
      return res;
    },
    // 8. Si la respuesta es un error...
    async (err) => {
      const originalConfig = err.config;

      // 9. Si el error es 401 (Unauthorized) Y NO es una petición de reintento
      if (err.response?.status === 401 && !originalConfig._retry) {
        // 10. Marcamos esta petición como "ya reintentada"
        originalConfig._retry = true;

        // 11. Evita bucles infinitos: si el refresh TAMBIÉN falla con 401, nos rendimos.
        if (originalConfig.url === REFRESH_URL) {
          store.dispatch(logout()); // Llama a tu acción de logout
          return Promise.reject(err);
        }

        // 12. Carga el refresh token guardado
        const refreshToken = loadRefreshFromLocalStorage();

        if (!refreshToken) {
          // No hay refresh token, el usuario debe loguearse manualmente
          store.dispatch(logout());
          return Promise.reject(err);
        }

        try {
          // 13. ¡EL INTENTO DE CRISIS! Pide nuevos tokens
          const rs = await api.post(REFRESH_URL, {
            refresh: refreshToken,
          });

          // 14. El backend nos da nuevos tokens
          const { access, refresh } = rs.data;

          // 15. ¡ÉXITO! Actualiza todo:
          // a) Guarda el nuevo access token en Redux
          store.dispatch(setAccessToken(access));
          // b) Guarda el nuevo refresh token en localStorage (Rotación de Tokens)
          saveRefreshToLocalStorage(refresh);

          // 16. Actualiza el header de la petición ORIGINAL que falló
          originalConfig.headers["Authorization"] = `Bearer ${access}`;

          // 17. Reintenta la petición original (ej. /account/profile/) con el nuevo token
          return api(originalConfig);
        } catch (_error) {
          // 18. ¡EL REFRESH FALLÓ! (Token caducado/inválido)
          // El usuario debe loguearse de nuevo.
          store.dispatch(logout());
          return Promise.reject(_error);
        }
      }

      // 19. Si el error no es 401, solo devuélvelo.
      return Promise.reject(err);
    }
  );
};

export default setupInterceptors;
