import  { css } from "styled-components";

// Mixins
const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const flexColumn = css`
  ${flexCenter}
  flex-direction: column;
`;

const buttonBase = css`
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 80%;
  margin-top: 10px;
`;

const buttonHover = css`
  @media (hover: hover) {
    &:hover {
      background-color: transparent;
      transform: translateY(-2px);
    }
  }
`;

const darkModeText = css`
  @media (prefers-color-scheme: dark) {
    color: #fff;
    button:hover,
    .guest:hover {
      color: #fff;
    }
  }
`;

export { flexColumn, buttonBase, flexCenter, buttonHover, darkModeText };
