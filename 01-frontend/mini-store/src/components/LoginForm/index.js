import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, fetchUser } from "../../redux/slices/userSlice";
import { LoginFieldset, LoginFormContainer } from "./styled";
import { useNavigate } from "react-router-dom";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 2. Espera (await) a que el dispatch termine y usa .unwrap()
      // 'responseData' será tu 'response.data' si tiene éxito
      await dispatch(fetchUser({ email, password })).unwrap();
      await dispatch(fetchProfile()).unwrap();

      // 4. Si llegamos aquí, el login fue exitoso. Navega.
      navigate("/");
    } catch (rejectedValue) {
      // 5. Si .unwrap() falla, el 'catch' se activa
      // 'rejectedValue' es lo que enviaste con 'rejectWithValue'
      console.error("Error del fetch:", rejectedValue);

      // No navegamos, el usuario sigue en el login
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleGuest = () => {
    navigate("/");
  };
  return (
    <LoginFormContainer>
      <LoginFieldset>
        <h2>Nice to see you again!</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {status === ASYNC_STATUS.REJECTED && error && (
            <span style={{ color: "red" }}>{error.detail}</span>
          )}
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password123"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
