import React from "react";
import {
  CartContainer,
  ItemContainer,
  CartItem,
  RemoveButton,
  CloseButton,
  BuyButton,
} from "./styled";
import CartSvg from "./CartSVG/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  removeFromCart,
  toggleCart,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.cart.isOpen);
  const accessToken = useSelector((state) => state.user.accessToken);
  const items = useSelector((state) => state.cart.items);
  const totalAmount = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  let isLogin = null;
  {
    accessToken ? (isLogin = true) : (isLogin = false);
  }

  const handleCloseClick = () => {
    dispatch(toggleCart());
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    dispatch(toggleCart());
    navigate("/checkout");
  };

  const handleLogin = () => {
    alert("You must be registered and logged in to buy!");
    dispatch(toggleCart());
    navigate("/login");
  };

  return (
    <CartContainer $isOpen={isOpen}>
      <CloseButton
        role="check-box"
        onClick={handleCloseClick}
        aria-label="close-Cart"
      >
        X
      </CloseButton>
      <div>
        <h2>Your Cart</h2>
        <p>Total: ${totalAmount}</p>
      </div>
      <hr />
      {items.length === 0 ? (
        <>
          <CartSvg />
          <p>No items in the cart!.</p>
          <BuyButton className="buy-button" onClick={handleCloseClick}>
            ⬅️Add some items, please!
          </BuyButton>
        </>
      ) : (
        <>
          <ItemContainer>
            {items.map((item) => (
              <CartItem key={item.id} role="listitem">
                <img src={item.imageUrl} alt={item.title} />
                <figcaption>
                  <span>{item.title}</span>
                  <p>
                    ${item.price}
                    &times; {item.quantity}
                  </p>
                </figcaption>
                <RemoveButton
                  onClick={() => handleRemove(item.id)}
                  aria-label="remove-Item"
                  role="button"
                >
                  Remove
                </RemoveButton>
              </CartItem>
            ))}
          </ItemContainer>
          <BuyButton
            {...(isLogin
              ? { className: "buy-button", onClick: handleCheckout }
              : { className: "buy-button-disabled", onClick: handleLogin })}
          >
            Buy
          </BuyButton>
          <BuyButton onClick={handleClear} className="clear">
            Vaciar carrito
          </BuyButton>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
