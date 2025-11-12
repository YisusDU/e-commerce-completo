import styled from "styled-components";
import Theme from "../../styles";

const PostCheckoutContainer = styled.article`
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  background: linear-gradient(#00ff2d6e 0%, ${Theme.colors.background} 50%);
  box-sizing: border-box;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      #00ff2d6e 0%,
      ${Theme.colors.darkModeBackground} 50%
    );
  }
`;

export { PostCheckoutContainer };
