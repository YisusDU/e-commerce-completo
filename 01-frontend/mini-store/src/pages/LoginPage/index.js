import React from "react";
import logo from "../../assets/img/logoEcomm.jpg";
import {
  LoginContainer,
  LogTitle,
  LogOptions,
  LoginImg,
  LoginSignIn,
} from "./styles";
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <LoginContainer>
      <LogOptions>
        <LoginImg />
        <LoginSignIn>
          <LogTitle>
            <img src={logo} alt="logo-store" />
            <h1>
              Welcome to <span>Mini Store</span>
            </h1>
          </LogTitle>
          <LoginForm />
        </LoginSignIn>
      </LogOptions>
    </LoginContainer>
  );
};

export default LoginPage;
