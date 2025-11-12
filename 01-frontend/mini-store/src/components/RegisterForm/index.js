import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../redux/slices/userSlice";
import { FormContaier, Form, Title, Label, Input, Button } from "./styled";
import { Link, useNavigate } from "react-router-dom";
import { ASYNC_STATUS } from "../../constants/asyncStatus";

const RegisterForm = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match ");
      return;
    }

    try {
      await dispatch(createUser({ username, email, password })).unwrap();
      navigate("/");
    } catch (rejectedValue) {
      console.error("Error del fetch:", rejectedValue);
    }
  };

  return (
    <FormContaier>
      <Form onSubmit={handleSubmit}>
        <Title>Register</Title>
        <Label>User</Label>
        <Input
          placeholder="Tu nombre de Usuario"
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        {status === ASYNC_STATUS.REJECTED && error && error.username && (
          <p style={{ color: "red" }}>{error.username[0]}</p>
        )}
        <Label>Email</Label>
        <Input
          placeholder="Añadetuemail@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {status === ASYNC_STATUS.REJECTED && error && error.email && (
          <p style={{ color: "red" }}>{error.email[0]}</p>
        )}
        <Label>Password</Label>
        <Input
          placeholder="Escribe tu contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {status === ASYNC_STATUS.REJECTED && error && error.password && (
          <p style={{ color: "red" }}>{error.password[0]}</p>
        )}
        <Label>Confirm Password</Label>
        <Input
          placeholder="Escribe tu contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => SetConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Form>
    </FormContaier>
  );
};

export default RegisterForm;
