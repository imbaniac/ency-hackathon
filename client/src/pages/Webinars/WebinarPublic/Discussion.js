import { useEffect, useState } from "react";
import styled from "styled-components";

const Discussion = () => {
  const [tempComment, setTempComment] = useState([
    {
      text: "Hello",
    },
    { text: "Second" },
  ]);
  const [value, setValue] = useState("");

  useEffect(() => {}, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSend = () => {
    setTempComment([...tempComment, { text: value }]);
  };

  return (
    <Container>
      <h3>Comments</h3>
      <textarea onChange={handleChange} placeholder="Enter your comment" />
      <Button onClick={handleSend}>Send</Button>
      <Comments>
        {tempComment.map((comment) => (
          <div>{comment.text}</div>
        ))}
      </Comments>
    </Container>
  );
};

const Container = styled.div``;

const Comments = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    border: 1px solid #111;
    padding: 20px;
    margin: 10px;
    background: #fff;
  }
`;

const Button = styled.button``;

export default Discussion;
