import React from "react";
import CheckoutForm from "../../components/CheckoutForm";
import {CheckoutContainer} from "./styled"

const CheckoutPage = () => {
  return (
    <CheckoutContainer>
      <CheckoutForm />
    </CheckoutContainer>
  );
};

export default CheckoutPage;
