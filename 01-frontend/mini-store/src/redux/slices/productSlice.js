import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";
import { FETCH_PRODUCTS } from "../../constants/actionTypes";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

// Operaciones asíncronas
export const fetchProducts = createAsyncThunk(FETCH_PRODUCTS, async () => {
  const response = await api.get("/api/v1/products/");
  return response.data;
});

//  Estados de la petición: idle, pending, fulfilled, rejected
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  // Los extrareducers se utilizan para manejar ops asíncronas
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
