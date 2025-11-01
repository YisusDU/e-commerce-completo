import React from "react";
import RegisterForm from "../../components/RegisterForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logoEcomm.jpg";
import {
  RegistryContent,
  RegistryImg,
  RegistryContainer,
  RegistryLogo,
  RegistryOptions,
} from "./styles.js";

const Registry = () => {
  return (
    <>
      <RegistryContainer>
        <RegistryOptions>
          <RegistryContent>
            <RegistryLogo>
              <img src={logo} alt="logo-ecommerce" />
              <span>Mini Store</span>
            </RegistryLogo>
            <RegisterForm />
          </RegistryContent>
          <RegistryImg />
        </RegistryOptions>
      </RegistryContainer>
    </>
  );
};

export default Registry;
