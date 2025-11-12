import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ConfirmationContainer,
  Button,
  ProductList,
  ProductItem,
  ItemDetails,
} from "./styled";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../redux/slices/orderSlice";

const ConfirmationStep = ({ selectedAddress, paymentMethod, prevStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // En tu ConfirmationStep.jsx

  const handleConfirm = async () => {
    setIsLoading(true);
    // 1. Construye un array de 'items' que el backend pueda entender
    const orderItems = cartItems.map((item) => ({
      product_id: item.id, // ID del producto
      quantity: item.quantity, // ¡La cantidad!
    }));

    // 2. Construye el payload de la orden
    const orderPayload = {
      shipping_address_id: selectedAddress.id, // 👈 Usa el ID
      items: orderItems,
      // ¡NO SE ENVÍA EL TOTAL! El backend lo calcula.
    };

    try {
      // c) Despacha la orden y ESPERA (await)
      await dispatch(createOrder(orderPayload)).unwrap();

      // d) ¡ÉXITO! Ahora borra el carrito y navega
      navigate("/post-checkout");
    } catch (error) {
      // e) ¡FALLÓ! Muestra un error
      console.error("Failed to create order:", error);
      alert("There was an error creating your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Si la dirección aún no se ha cargado (rara vez pasa, pero es seguro)
  if (!selectedAddress) {
    return <p>Loading confirmation details...</p>;
  }

  return (
    <ConfirmationContainer>
      <h3>Confirm your Order</h3>
      <p>
        <strong>Shipping Address: </strong>
        {selectedAddress.nickname && `(${selectedAddress.nickname}) `}
        {selectedAddress.address_line_1}, {selectedAddress.city},{" "}
        {selectedAddress.state}
      </p>
      <p>
        <strong>Payment Method: </strong>
        {paymentMethod}
      </p>
      <hr />
      <ProductList>
        {cartItems.map((item) => (
          <ProductItem key={item.id}>
            <ItemDetails>
              <img src={item.imageUrl} alt={item.title} />
              <div>
                <h4>{item.title}</h4>
                <p>
                  ${item.price.toFixed(2)} &times; {item.quantity}
                </p>
              </div>
            </ItemDetails>
          </ProductItem>
        ))}
      </ProductList>
      <p>
        <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
      </p>
      <Button type="button" onClick={prevStep} className="back small">
        Back
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isLoading} // 👈 Deshabilita el botón mientras se crea
      >
        {isLoading ? "Placing Order..." : "Confirm Order"}
      </Button>
    </ConfirmationContainer>
  );
};

export default ConfirmationStep;
