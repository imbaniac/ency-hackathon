import { useContext, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import UserContext from "../../utils/UserContext";

const ApiKeyForm = () => {
  const { apiKey, setApiKey } = useContext(UserContext);
  const [value, setValue] = useState(apiKey);
  const history = useHistory();

  const handleApiKeyChange = (e) => {
    setValue(e.target.value);
  };

  const handleSetApiKey = (e) => {
    e.preventDefault();
    setApiKey(value);
    localStorage.setItem("livepeer-api-key", value);
    history.push("/webinars");
  };

  return (
    <Container>
      <Form onSubmit={handleSetApiKey}>
        <H1>Welcome to Ency</H1>
        <Input
          pattern="\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b"
          onChange={handleApiKeyChange}
          type="text"
          placeholder="Enter your api key"
        />
        <Button>Sign up</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`;

const H1 = styled.h1`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
  justify-content: center;
  margin-bottom: 15%;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1rem;
`;
const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
`;

export default ApiKeyForm;
