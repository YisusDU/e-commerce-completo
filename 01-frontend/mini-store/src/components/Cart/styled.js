import styled from "styled-components";
import Theme from "../../styles";
import { darkModeText, flexColumn } from "../../styles/mixins";

const CartContainer = styled.aside`
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: fit-content;
  position: fixed;
  top: 15px;
  box-shadow: 23px 18px 56px rgb(81 81 81);
  transition: right 0.3s ease-in-out;
  display: ${({ $isOpen }) => ($isOpen ? "" : "none")};
  right: ${({ $isOpen }) => ($isOpen ? "0px" : "")};

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    ${darkModeText}
  }

  hr {
    margin: 10px 0;
  }

  svg {
    width: 40%;
  }

  div > p {
    font-size: 1.2rem;
    margin-bottom: 5px;
    ${darkModeText}
  }

  @media (prefers-color-scheme: dark) {
    background-color: #919191;
  }

  @media (hover: hover) and (pointer: fine) {
    .buy-button:hover {
      scale: 1.05;
      transition: scale 0s ease-in-out;
    }
  }
`;

const BuyButton = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 20px;
  transition: scale 0.3s ease-in-out;
  margin: 0 5px;

  &.buy-button {
    background-color: #007bff;
    color: #fff;
    border: none;
  }

  &.buy-button-disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  &.clear {
    background-color: ${Theme.colors.tertiary};
    float: right;
  }
`;

const ItemContainer = styled.ul`
  ${flexColumn}
  justify-content: flex-start;
  max-height: 65dvh;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const CartItem = styled.li`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;

  img {
    width: 50px;
    height: 50px;
  }

  figcaption {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-left: 10px;

    span {
      max-width: 165px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    p {
      width: 100%;
      text-align: center;
      font-weight: bold;
      }
    }
  }
`;

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${Theme.colors.tertiary};
  }
`;

const CloseButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

export {
  CartItem,
  RemoveButton,
  ItemContainer,
  CartContainer,
  CloseButton,
  BuyButton,
};
