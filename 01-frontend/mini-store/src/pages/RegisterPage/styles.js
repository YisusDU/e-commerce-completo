import styled, { css } from "styled-components";
import Theme from "../../styles";
import resgistryImg from '../../assets/img/registryImg.jpg'
import { flexColumn, buttonBase, flexCenter, buttonHover, darkMode} from "../../styles/mixins"


const RegistryContainer = styled.article`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 460px;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #efefef;   
    box-sizing: border-box;

    @media (prefers-color-scheme: dark) {
    background-color:rgb(98, 98, 98);
    color: #fff;
    p {
      color: #fff;
    }
    }
    
`;

const RegistryOptions = styled.section`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    border-radius: 10px;
    background-color: ${Theme.colors.background};
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
    }
    ${darkMode}
`;

const RegistryLogo = styled.figure`
  top: 10%;
  ${flexColumn}
  text-align: center;
  width: 40%;
  min-width: 225px;
  height: auto;
  border-radius: 10px;
  padding: 20px;
  color: #000;
  box-sizing: border-box;

  img{
    width: 80%;
    border-radius: 10px;
    box-shadow: 5px 5px 13px rgba(0, 0, 0, 0.5);
    margin: 10px 0;
    }
span{
    width: fit-content;
    font-size: 2em;
    color: #fff;
    font-weight: bold;
    font-style: italic;
    background-color: #51bbbba8;
    border-radius: 10px;
    padding: 0 5px;
}
    
    @media (max-width: 768px) {
        position: absolute;
        max-width: 250px;
        padding: 10px;
        span{
            color: #fff;
        }
    }
`;

const RegistryContent = styled.div`
    width: 60%;
    height: 100%;
    ${flexColumn}
    justify-content: center;
    box-sizing: border-box;
    padding: 10px 5%;
    border-radius: 10px 0px 0px 10px;
    h1 {
        font-size: 2em;
        margin-bottom: 10px;
        align-self: start;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const RegistryImg = styled.div`
    width: 40%;
    background-image: url(${resgistryImg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center 20%;
    border: none;

    @media (max-width: 768px){
        width: 100%;
        height: 43vh;
    }
`;


export { 
    RegistryContent, 
    RegistryImg, 
    RegistryContainer, 
    RegistryLogo,
    RegistryOptions 
};