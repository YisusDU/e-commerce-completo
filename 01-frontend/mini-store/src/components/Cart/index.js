import React, { useEffect, useRef } from "react";
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

// El selector de elementos que pueden recibir foco
const focusableElementsSelector =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  const isLogin = !!accessToken;

  // Necesario para el foco
  const cartContainerRef = useRef(null);

  useEffect(() => {
    const container = cartContainerRef.current;
    if (isOpen && container) {
      //  Mueve el foco al contenedor (¡esto ya lo tenías!)
      container.focus();

      // "Focus Trap" ---
      const focusableElements = container.querySelectorAll(
        focusableElementsSelector
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key !== "Tab") return;

        // Si el usuario presiona Shift + Tab (hacia atrás)
        if (e.shiftKey) {
          // Si estamos en el PRIMER elemento, saltamos al ÚLTIMO
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        }
        // Si el usuario presiona solo Tab (hacia adelante)
        else {
          // Si estamos en el ÚLTIMO elemento, saltamos al PRIMERO
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      // Añade el escuchador
      container.addEventListener("keydown", handleKeyDown);

      //Función de Limpieza
      return () => {
        container.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

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
    <CartContainer
      $isOpen={isOpen}
      ref={cartContainerRef}
      tabIndex="-1" // Lo hace focuseable con JS
      role="dialog" // Anuncia: "Esto es un diálogo"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <CloseButton onClick={handleCloseClick} aria-label="close-Cart">
        <span aria-hidden="true">X</span>
      </CloseButton>
      <div>
        <h2 id="cart-title">Your Cart</h2>
        <p>Total: ${totalAmount.toFixed(2)}</p>
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
                    ${item.price.toFixed(2)}
                    &times; {item.quantity}
                  </p>
                </figcaption>
                <RemoveButton
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
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
            disabled={!isLogin}
          >
            Buy
          </BuyButton>
          <BuyButton onClick={handleClear} className="clear">
            Clear Cart
          </BuyButton>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
