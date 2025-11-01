import styled from "styled-components";
import loginPortade from "../../assets/img/portadeLogin.jpg";
import {
  flexColumn,
  buttonBase,
  darkModeText,
  buttonHover,
} from "../../styles/mixins";

const LoginContainer = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #efefef;
  color: white;
  box-sizing: border-box;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(98, 98, 98);
    color: #fff;
    p {
      color: #fff;
    }
  }
`;

const LogOptions = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 97dvh;
  min-width: 320px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
  @media (prefers-color-scheme: dark) {
    background-color: #919191;
  }
`;

const LoginImg = styled.div`
  width: 70%;
  background-image: url(${loginPortade});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: none;

  @media (max-width: 768px) {
    width: 100%;
    height: 43vh;
  }
`;

const LoginSignIn = styled.div`
  position: relative;
  z-index: 1;
  ${flexColumn}
  width: 30%;
  height: 100%;
  padding: 0 0 20px 0;
  box-sizing: border-box;
  background-color: #efefef;

  button {
    ${buttonBase}
    background-color: #28a745;
    border: 2px solid #28a745;
    color: white;

    ${buttonHover}
    &:hover {
      color: #28a745;
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
  }

  .guest {
    ${buttonBase}
    background-color: rgb(167, 51, 40);
    border: 2px solid rgb(167, 51, 40);
    color: #fff;

    ${buttonHover}
    &:hover {
      color: rgb(167, 51, 40);
      box-shadow: 0 5px 15px rgba(167, 51, 40, 0.3);
    }
  }

  ${darkModeText}
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: fit-content;
    border-right: none;
    border-bottom: 1px solid #000;
  }

  p {
    margin: 20px 0;
    font-size: 1.2em;
    color: #666;
    position: relative;
    text-align: center;
    width: 100%;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 35%;
      height: 1px;
      background-color: #ccc;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }

  .notAcount {
    margin: 0;
    color: #333;
    font-size: 1.3em;
    text-align: center;
  }

  @media (hover: hover) {
    button:hover {
      background-color: transparent;
      color: #28a745;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: #919191;
    color: #fff;
    p {
      color: #fff;
    }

    .notAcount {
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

const LogTitle = styled.section`
  top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 50%;
  min-width: 225px;
  height: auto;
  border-radius: 10px;
  padding: 20px;
  color: #000;
  box-sizing: border-box;

  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);
    margin: 0;
  }
  h1 {
    font-size: 2em;
    margin: 0;
    width: 100%;
    color: #d33636;
  }
  span {
    color: #fff;
    font-weight: bold;
    font-style: italic;
    background-color: #51bbbba8;
    border-radius: 10px;
    padding: 0 5px;
    text-wrap: nowrap;
  }

  @media (max-width: 768px) {
    max-width: 250px;
    padding: 10px;
    position: absolute;
    top: -360px;
    span {
      color: #fff;
    }
  }
`;

export { LoginContainer, LogTitle, LogOptions, LoginImg, LoginSignIn };
