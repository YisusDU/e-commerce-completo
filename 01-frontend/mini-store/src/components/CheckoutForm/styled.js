import styled from "styled-components";
import {
  flexColumn,
  buttonBase,
  darkModeText,
  buttonHover,
  flexCenter,
} from "../../styles/mixins";

// index.js
const FormContainer = styled.section`
  ${flexColumn}
  width: 80%;
  box-sizing: border-box;
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
  background-color: #efefef;
  box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);

  form {
    ${flexColumn}
    width: 80%;
    padding: 10px 0;
    gap: 10px;
  }
  // for shippingStep
  .mask {
    width: 100%;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }
    &.valid {
      border: 2px solid #4caf50;
    }

    &.invalid {
      border: 2px solid #f44336;
    }

    &.radio {
      width: 10px;
    }
  }

  @media (hover: hover) {
    button:hover {
      background-color: transparent;
      color: #28a745;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }

    .guest:hover {
      background-color: transparent;
      color: rgb(167, 51, 40);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(167, 51, 40, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: #919191;
    box-shadow: 11px 9px 20px 4px rgb(0 0 0);

    color: #fff;
    p {
      color: #fff;
    }

    @media (hover: hover) {
      button:hover,
      .guest:hover {
        color: #fff;
      }
    }
  }
`;

// ProgressBar

const ProgressContainer = styled.section`
  ${flexCenter}
  width:100%;
  flex-direction: row;
  margin: 10px;
  border-bottom: 2px solid #000;

  @media (prefers-color-scheme: dark) {
    border-bottom: 2px solid #fff;
  }
`;

const Step = styled.div`
  ${flexCenter}
  border-top: 5px solid;
  border-top-color: ${(props) => (props.$active ? "#28a745" : "#b9b9b9")};
  color: ${(props) => (props.$active ? "#fff" : "#333")};
  padding: 5px;
  width: 25%;
  text-align: center;
  margin: 5px;
`;

const StepLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #000;
  ${darkModeText}
`;

// ShippingStep and PaymentStep
const AddressContainer = styled.section`
  ${flexColumn}
  text-align:center;
`;

const Label = styled.label`
  width: 100%;
  text-align: left;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
  color: #000;
  ${darkModeText}

  &.address {
    display: flex;
    flex-direction: row;
    width: fit-content;
    text-align: center;
  }
`;

const Navigation = styled.div`
  ${flexColumn}
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
  &.valid {
    border: 2px solid #4caf50;
  }

  &.invalid {
    border: 2px solid #f44336;
  }

  &.radio {
    width: 10px;
  }
`;

const Button = styled.button`
  ${buttonBase}
  ${buttonHover}
  text-align:center;
  background-color: #28a745;
  border: 2px solid #000;
  color: white;
  width: 70%;
  margin: 0;

  &.back {
    background-color: rgb(167, 51, 40);
  }
  &.small {
    width: 40%;
  }
  &.fit {
    width: fit-content;
  }
`;

// ConfirmationStep

const ConfirmationContainer = styled.section`
  ${flexColumn}
  width:100%;
  gap: 10px;
  text-align: left;

  h3 {
    font-size: 2rem;
    width: 100%;
  }

  & > p {
    font-size: 1.2rem;
    width: 80%;

    strong {
      font-weight: 800;
    }
  }

  & > p:nth-of-type(3) {
    width: 90%;
    text-align: end;
    border-top: 1px solid;
  }

  hr {
    width: 90%;
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
  gap: 0.5rem;
  width: 100%;
  justify-items: center;
`;

const ProductItem = styled.div`
  ${flexCenter}
  width:100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
`;

const ItemDetails = styled.figure`
  ${flexCenter}
  width:100%;
  justify-content: space-around;
  color: #000;

  img {
    width: 100px;
  }
  div {
    ${flexCenter}
    justify-content: space-between;
    gap: 5px;
    width: 50%;
    @media screen and (max-width: 59rem) {
      text-align: center;
      flex-direction: column;
    }

    h4 {
      font-size: 1.2rem;
      width: fit-content;
      text-align:justify;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    p {
      width: fit-content;
      font-size: 1rem;
      text-align: end;
      color: #000;
      text-decoration: underline red 2px;
      }
    }
  }
`;

export {
  FormContainer,
  ProgressContainer,
  Step,
  StepLabel,
  Label,
  Input,
  Button,
  ConfirmationContainer,
  ProductList,
  ProductItem,
  ItemDetails,
  AddressContainer,
  Navigation,
};
