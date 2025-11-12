import styled from "styled-components";
import Theme from "../../styles";
import { flexCenter, flexColumn } from "../../styles/mixins";

const Container = styled.section`
  ${flexColumn}
  width:100%;
  gap: 10px;

  button {
    width: 50%;
    margin-top: 20px;
    padding: 12px 24px;
    color: white;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${Theme.colors.secondary};
    border: 2px solid ${Theme.colors.secondary};
  }

  @media (hover: hover) {
    & > button:hover {
      background-color: transparent;
      color: ${Theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
`;

const Message = styled.p`
  color: ${Theme.fonts.color.primary};
  font-size: 1.2rem;
  text-align: center;
  font-style: italic;
  font-size: 1.2rem;
`;

const OrderDetails = styled.div`
  ${flexColumn}
  width:90%;
  > p {
    font-size: 1.5rem;
  }

  hr {
    width: 80%;
    border: 2px solid;
  }
`;

const ProductList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
  gap: 0.5rem;
  width: 100%;
  justify-items: center;
`;

const ProductItem = styled.li`
  ${flexCenter}
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
`;

const ItemDetails = styled.figure`
  ${flexCenter}
  width: 100%;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 50px;
  }
  div {
    ${flexCenter}
    width:60%;
    justify-content: space-evenly;
    gap: 10px;

    h4 {
      font-size: 1.2rem;
      text-align: justify;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    p {
      font-size: 1.2rem;
      text-align: center;
    }
  }
`;

export {
  Container,
  Title,
  Message,
  OrderDetails,
  ProductList,
  ProductItem,
  ItemDetails,
};
