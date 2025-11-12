import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import addressReducer from "./slices/addressSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    address: addressReducer,
  },
});

export default store;
