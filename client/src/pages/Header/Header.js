import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../../utils/UserContext";

const Header = () => {
  const { apiKey } = useContext(UserContext);

  return (
    <Nav>
      <Logo>Ency</Logo>
      <User>{apiKey}</User>
    </Nav>
  );
};

const Nav = styled.nav`
  padding: 20px;
  background: #008477;
  color: #fff;
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-family: "Roboto Condenced", sans-serif;
`;

const User = styled.div``;

export default Header;
