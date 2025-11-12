import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import {
  CREATE_USER,
  FETCH_PROFILE,
  FETCH_USER,
} from "../../constants/actionTypes";
import { ASYNC_STATUS } from "../../constants/asyncStatus";
import { saveRefreshToLocalStorage } from "../../helpers/localStorageHelpers";

// Para iniciar sesión
export const fetchUser = createAsyncThunk(
  FETCH_USER,
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/account/api/token/", {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Para traer datos de la cuenta del usuario
export const fetchProfile = createAsyncThunk(
  FETCH_PROFILE,
  async (_, { rejectWithValue }) => {
    try {
      // El interceptor se encarga del header 'Authorization'
      const response = await api.get("/account/profile/");
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// Para Create de usuarios
export const createUser = createAsyncThunk(
  CREATE_USER,
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.post("/account/register/", {
        username: user.username,
        email: user.email,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error);
      } else {
        // Si es un error inesperado, pasa el mensaje genérico
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    status: ASYNC_STATUS.IDLE,
    accessToken: null,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.status = ASYNC_STATUS.IDLE;
      state.error = null;
      localStorage.removeItem("refresh");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos de fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.accessToken = action.payload.access;
        saveRefreshToLocalStorage(action.payload.refresh);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload;
        state.accessToken = null;
        state.currentUser = null;
      })
      // casos del la petición de datos del perfil
      .addCase(fetchProfile.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.error = null;
        state.currentUser = {
          username: action.payload.username,
          email: action.payload.email,
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload;
        state.currentUser = null;
        state.accessToken = null;
      })
      //   Casos de createUser
      .addCase(createUser.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.currentUser = {
          username: action.payload.username,
          email: action.payload.email,
        };
        state.accessToken = action.payload.token.access;
        saveRefreshToLocalStorage(action.payload.token.refresh);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload;
        state.currentUser = null;
        state.accessToken = null;
      });
  },
});

export const { clearUser, logout, setAccessToken } = userSlice.actions;
export default userSlice.reducer;
