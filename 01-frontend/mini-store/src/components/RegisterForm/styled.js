import styled from "styled-components";
import {
  flexCenter,
  flexColumn,
  buttonBase,
  buttonHover,
  darkModeText
} from "../../styles/mixins";

const FormContaier = styled.section`
  ${flexColumn}
  width: 90%;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  z-index: 2;
  box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);

  p {
    font-weight: 400px;
  }
  ${darkModeText}
  @media (hover: hover) and (pointer: fine) {
    button:hover {
      ${buttonHover}
      color: #007bff;
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    h2,
    form label {
      color: #fff;
    }

    @media (hover: hover) and (pointer: fine) {
      button:hover {
        ${buttonHover}
        color: #fff;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 0px;
`;

const Title = styled.h1`
  width: 100%;
  color: #000;
  font-weight: bold;
  font-size: 1.5em;
  text-align: left;
  margin: 0;
  font-size: clamp(15px, 23px, 22px);
  text-wrap: nowrap;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
`;

const Button = styled.button`
  ${buttonBase}
  ${buttonHover}
  background-color: #007bff;
  border: 2px solid #007bff;
  color: white;
  width: 100%;
  margin: 0;
`;

export { FormContaier, Form, Title, Label, Input, Button };
