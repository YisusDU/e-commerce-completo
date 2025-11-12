import React from "react";
import ProductHeader from "../../components/Header";
import ProductList from "../../components/ProductList";
import Cart from "../../components/Cart";

const HomePage = () => {
  return (
    <>
      <ProductHeader />
      <ProductList />
      <Cart />
    </>
  );
};

export default HomePage;
