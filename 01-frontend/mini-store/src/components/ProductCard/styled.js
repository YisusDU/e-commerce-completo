import styled from "styled-components";
import { darkModeText, flexColumn } from "../../styles/mixins";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #282c34;
  border-radius: 5px;
  text-align: center;
  box-sizing: border-box;
  max-width: 250px;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(145, 145, 145, 0.86);
      transition: all 0.1s ease;
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: #919191;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Info = styled.figcaption`
  ${flexColumn}
  ${darkModeText}
  font-weight: bold;
  gap: 10px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Price = styled.p`
  font-size: 1.2rem;
`;

const AddButton = styled.button`
  height: 40px;
  padding: 0.5rem 1rem;
  background-color: #282c34;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #282c34d1;
      transition: all 0.3s ease;
    }
    &:active {
      background-color: #282c3499;
      scale: 0.99;
      transition: all 0.1s ease;
    }
  }
`;

export { Card, Image, Info, Title, Price, AddButton };
