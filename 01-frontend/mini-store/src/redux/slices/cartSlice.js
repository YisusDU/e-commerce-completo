import { createSlice } from "@reduxjs/toolkit";
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
  updateItems,
} from "../../helpers/localStorageHelpers";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(),
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      state.items = updateItems(state.items, action.payload, 1);
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = updateItems(state.items, action.payload, -1);
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state, action) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, toggleCart } =
  cartSlice.actions;
export default cartSlice.reducer;
