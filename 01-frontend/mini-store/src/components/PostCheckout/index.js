import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import {
  Container,
  Title,
  Message,
  OrderDetails,
  ProductList,
  ProductItem,
  ItemDetails,
} from "./styled";

const PostCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.order.totalAmount);

  const handleBackToHome = () => {
    dispatch(clearOrder());
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <Container>
      <Title>Order Confirmed!</Title>
      <Message>
        Thank your for your purchase. Here are the details of your order:
      </Message>
      <OrderDetails>
        <ProductList>
          {order.map((item) => (
            <ProductItem key={item.id}>
              <ItemDetails>
                <img src={item.imageUrl} alt={item.title} />
                <div>
                  <h4>{item.title} </h4>
                  <p>
                    ${item.price.toFixed(2)} &times; {item.quantity}
                  </p>
                </div>
              </ItemDetails>
            </ProductItem>
          ))}
        </ProductList>
        <hr />
        <p>
          <strong>Total Amount:</strong> ${totalAmount}
        </p>
      </OrderDetails>
      <button onClick={handleBackToHome}>Back to Home</button>
    </Container>
  );
};

export default PostCheckout;
