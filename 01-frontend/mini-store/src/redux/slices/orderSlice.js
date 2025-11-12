import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { CREATE_ORDER } from "../../constants/actionTypes";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

export const createOrder = createAsyncThunk(
  CREATE_ORDER,
  async (orderPayload, { rejectWithValue }) => {
    try {
      // 'orderPayload' es el objeto: { shipping_address_id, items }
      const response = await api.post("/api/v1/orders/create/", orderPayload);
      return response.data; // Devuelve la nueva orden creada
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    totalAmount: 0,
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.status = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = ASYNC_STATUS.PENDING;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.FULFILLED;
        state.items = action.payload;
        state.totalAmount = action.payload.total_amount;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = ASYNC_STATUS.REJECTED;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
