import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HeaderLogo,
  HeaderContainer,
  HeaderSearch,
  HeaderUser,
  HeaderCart,
} from "./styled";
import { toggleCart } from "../../redux/slices/cartSlice";
import {
  fetchProfile,
  logout,
  verifyLogin,
} from "../../redux/slices/userSlice";
import { setSearchTerm } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import SVGCart from "./SvgCart";
import SvgUser from "./SvgUser";
import logo from "../../assets/img/logoEcomm.jpg";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

const ProductHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsInCart = useSelector((state) => state.cart.items);
  const cartItemsCount = itemsInCart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  const accessToken = useSelector((state) => state.user.accessToken);
  const status = useSelector((state) => state.user.status);
  const user = useSelector((state) => state.user.currentUser);
  let isLogin = null;

  {
    accessToken ? (isLogin = true) : (isLogin = false);
  }
  useEffect(() => {
    // Solo lo llamamos si no lo hemos hecho antes (status 'idle')
    if (status === ASYNC_STATUS.PENDING) {
      dispatch(fetchProfile());
    }
  }, [dispatch, status]);

  const toggleLogin = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCloseCart = () => {
    dispatch(toggleCart());
  };

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <HeaderContainer>
      <HeaderLogo>
        <img src={logo} alt="logo-store" />
        <h1>
          <span>Mini Store</span> v3.5
        </h1>
      </HeaderLogo>
      <HeaderSearch>
        <input
          type="search"
          placeholder="Type some item name..."
          onChange={handleSearch}
        />
        <button>🔍</button>
      </HeaderSearch>
      <HeaderUser onClick={toggleLogin}>
        <SvgUser />
        <p role="button" aria-label="user-name">
          {status === ASYNC_STATUS.FULFILLED && isLogin && user
            ? `${user?.username} logout`
            : "Guest, Login?"}
        </p>
      </HeaderUser>
      <HeaderCart onClick={handleCloseCart}>
        <SVGCart />
        <span role="button" aria-label="cart-count">
          {cartItemsCount}
        </span>
      </HeaderCart>
    </HeaderContainer>
  );
};

export default ProductHeader;
