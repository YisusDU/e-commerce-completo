import api from "../../api";
import { FETCH_ADDRESSES, ADD_ADDRESS } from "../../constants/actionTypes";
import { ASYNC_STATUS } from "../../constants/asyncStatus";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ---  OBTENER DIRECCIONES (GET) ---
export const fetchAddresses = createAsyncThunk(
  FETCH_ADDRESSES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/addresses/");
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// ---  AÑADIR DIRECCIÓN (POST) ---
export const addAddress = createAsyncThunk(
  ADD_ADDRESS,
  async (addressData, { rejectWithValue }) => {
    try {
      // 'addressData' es el objeto: { address_line_1, city, ... }
      const response = await api.post("/api/v1/addresses/", addressData);
      return response.data; // Devuelve la nueva dirección creada (con su ID)
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error.message);
      }
      // Devuelve los errores de validación (ej. "city: required")
      return rejectWithValue(error.response.data);
    }
  }
);

// --- EL SLICE ---
const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Casos para fetchAddresses (GET) ---
      .addCase(fetchAddresses.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.list = action.payload; // Reemplaza la lista con los datos frescos
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload;
      })

      // --- Casos para addAddress (POST) ---
      .addCase(addAddress.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING; // Muestra un 'loading'
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        //  Añade la nueva dirección a la lista existente en el estado
        state.list.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload; // Guarda los errores de validación
      });
  },
});

export const {} = addressSlice.actions;
export default addressSlice.reducer;
