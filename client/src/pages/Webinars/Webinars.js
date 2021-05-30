import { useContext, useEffect, useState } from "react";
import { Client, PrivateKey } from "@textile/hub";
import { useHistory } from "react-router";
import styled from "styled-components";
import { createStream, getStreams } from "../../api/stream";
import UserContext from "../../utils/UserContext";

const keyInfo = {
  key: process.env.KEY,
  secret: process.env.SECRET,
};

export const getIdentity = async () => {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem("user-private-identity");
  if (cached !== null) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(cached);
  }
  /** No cached identity existed, so create a new one */
  const identity = await PrivateKey.fromRandom();
  /** Add the string copy to the cache */
  localStorage.setItem("user-private-identity", identity.toString());
  /** Return the random identity */
  return identity;
};

export async function authorize(key, identity) {
  const client = await Client.withKeyInfo(key);
  await client.getToken(identity);
  return client;
}

export async function list(client) {
  const threads = await client.listThreads();
  return threads;
}

export async function createDB(client) {
  const thread = await client.newDB();
  return thread;
}

const Webinars = () => {
  const { apiKey } = useContext(UserContext);
  const [currentThreads, setCurrentThreads] = useState([]);
  const [lastWebinarId, setLastWebinarId] = useState(null);
  const [error, setError] = useState(null);
  const [streams, setStreams] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let interval;
    (async () => {
      const user = await getIdentity();
      const client = await authorize(keyInfo, user);

      interval = setInterval(async () => {
        const threads = await client.listThreads();
        if (threads.length !== currentThreads.length) {
          const newThread = threads[threads.length - 1];
          localStorage.setItem(`${lastWebinarId}`, newThread.id.toString());
          setCurrentThreads(threads);
        }
        console.log("CURRENT", threads);
      }, 5000);
    })();

    return clearInterval(interval);
  }, [lastWebinarId]);

  useEffect(() => {
    fetchStreams();
  }, [apiKey]);

  const fetchStreams = async () => {
    const streams = await getStreams(apiKey);
    setStreams(streams.data);
  };

  const handleCreateStream = async () => {
    try {
      const user = await getIdentity();
      const client = await authorize(keyInfo, user);

      try {
        const streamCreateResponse = await createStream(
          apiKey,
          `New Webinar ${streams.length}`
        );
        if (streamCreateResponse.data) {
          const { id: streamId } = streamCreateResponse.data;
          setLastWebinarId(streamId);
          client
            .newDB()
            .then((value) => {
              console.log("WTF", value);
            })
            .catch((e) => {
              console.log("SHIIT", e);
            });
          await fetchStreams();
          // history.push(`/webinars/${streamId}/new`);
        }
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          setError("Invalid API Key. Please try again with right API key!");
        } else {
          setError("Something went wrong! Please try again after sometime");
        }
      }
    } catch (e) {
      console.error("Threads", e);
    }
  };

  return (
    <Container>
      <Button onClick={handleCreateStream}>Create Webinar</Button>
      {error && <Error>{error}</Error>}
      <StreamsContainer>
        {streams.map((stream) => (
          <StreamItem key={stream.id}>
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
