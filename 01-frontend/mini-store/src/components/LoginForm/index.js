import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { LoginFieldset, LoginFormContainer } from "./styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { ASYNC_STATUS } from "../../constants/asyncStatus";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const {
    emailValid,
    passwordValid,
    validateInput,
    handleValidation,
    handleRegister,
    handleGuest,
  } = useAuth();

 
  return (
    <LoginFormContainer>
      <LoginFieldset>
        <h2>Nice to see you again!</h2>
        <form onSubmit={handleValidation}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            className={
              emailValid === null ? "" : emailValid ? "valid" : "invalid"
            }
            onBlur={validateInput}
          />
          <span
            className={emailValid === false ? "error-message" : "message-space"}
          >
            {emailValid === false && "Incorrect Email"}
          </span>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="text"
            name="password"
            placeholder="Password123"
            minLength={8}
            required
            className={
              passwordValid === null ? "" : passwordValid ? "valid" : "invalid"
            }
            onBlur={validateInput}
          />
          <span
            className={
              passwordValid === false ? "error-message" : "message-space"
            }
          >
            {passwordValid === false && "Incorrect Password"}
          </span>
          <button type="submit">Login</button>
        </form>
      </LoginFieldset>
      <p>Or......</p>
      <h2 className="notAcount">Don't you have an account?</h2>
      <button onClick={handleRegister}>Go to register!</button>
      <p>Or......</p>
      <button className="guest" onClick={handleGuest}>
        Continue as guest
      </button>
    </LoginFormContainer>
  );
};

export default LoginForm;
