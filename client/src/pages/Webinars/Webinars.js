import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { createStream, getStreams } from "../../api/stream";
import UserContext from "../../utils/UserContext";

const Webinars = () => {
  const { apiKey } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [streams, setStreams] = useState([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const streams = await getStreams(apiKey);
      setStreams(streams.data);
    })();
  }, [apiKey]);

  const handleCreateStream = async () => {
    try {
      const streamCreateResponse = await createStream(apiKey);
      if (streamCreateResponse.data) {
        const { id: streamId } = streamCreateResponse.data;
        history.push(`/webinars/${streamId}/new`);
      }
    } catch (error) {
      if (error.response.status === 403) {
        setError("Invalid API Key. Please try again with right API key!");
      } else {
        setError("Something went wrong! Please try again after sometime");
      }
    }
  };

  return (
    <Container>
      <Button onClick={handleCreateStream}>Create Webinar</Button>
      {error && <Error>{error}</Error>}
      <StreamsContainer>
        {streams.map((stream) => (
          <StreamItem>
            {stream.name}
            <Button
              onClick={() => {
                history.push(`/webinars/${stream.id}/settings`);
              }}
            >
              Open
            </Button>
          </StreamItem>
        ))}
      </StreamsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin: 20px;
  padding: 10px;
  width: 200px;
`;

const Error = styled.span`
  color: red;
`;

const StreamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;

const StreamItem = styled.div`
  padding: 20px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  background: white;
`;

export default Webinars;
