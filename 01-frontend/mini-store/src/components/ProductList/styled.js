import styled, { css } from "styled-components";

const screenMessage = css`
  display: block;
  // min-width: 480px;
  font-size: 40px;
  text-align: center;
  background-color: rgba(204, 204, 204, 0.8);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  width: 100%;
  height: 150vh;

  h2 {
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 10px;
    color: #000;
    text-wrap: wrap;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
`;

const StoreContainer = styled.main`
  margin: 0 auto;
  // min-width: 480px;

  @media (prefers-color-scheme: dark) {
    background-color: #cdcbcb;
  }
`;

const ProductsArray = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const CategorySection = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    padding-bottom: 0.5rem;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
    gap: 0.5rem;
    width: 100%;
    justify-items: center;
  }
`;

const ProductNotFound = styled.article`
  ${screenMessage}
`;

//Loading and error styles
const LoadingOrError = styled.article`
  ${screenMessage}
  flex-direction:column;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 140vh;
  position: absolute;
`;

export {
  StoreContainer,
  ProductsArray,
  LoadingOrError,
  CategorySection,
  ProductNotFound,
};
