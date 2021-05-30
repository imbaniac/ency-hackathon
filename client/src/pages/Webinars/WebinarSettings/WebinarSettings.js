import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Hls from "hls.js";
import styled from "styled-components";
import { Client, PrivateKey, ThreadID } from "@textile/hub";
import UserContext from "../../../utils/UserContext";
import { getStream } from "../../../api/stream";
import Discussion from "../WebinarPublic/Discussion";

async function getInfo(client, threadID) {
  return await client.getDBInfo(threadID);
}

async function joinFromInfo(client, info) {
  return await client.joinFromInfo(info);
}

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

const WebinarSettings = () => {
  const [webinar, setWebinar] = useState({});
  const { apiKey } = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const threadId = localStorage.getItem(params.id);
      console.log("CURRENT THREAD", threadId);

      const user = await getIdentity();
      const client = await authorize(keyInfo, user);

      const info = await getInfo(client, ThreadID.fromString(threadId));
      console.log("CURRENT INFO", info);
    })();

    let interval;
    if (params.id) {
      fetchWebinar();
      interval = setInterval(fetchWebinar, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [params.id]);

  useEffect(() => {
    if (webinar.playbackId) {
      const video = document.getElementById("video");
      const videoSrc = `https://cdn.livepeer.com/hls/${webinar.playbackId}/index.m3u8`;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      }
    }
  }, [webinar]);

  const fetchWebinar = async () => {
    const webinar = await getStream(apiKey, params.id);
    setWebinar(webinar.data);
  };

  return (
    <Container>
      <Header>
        <h1>{webinar.name}</h1>
        <Status isActive={webinar.isActive} />
      </Header>
      <Info>
        <div>Server URL: rtmp://rtmp.livepeer.com/live/</div>
        <div>Stream key: {webinar.streamKey}</div>
      </Info>
      <Video id="video" controls />
      <label>
        Share link to your guests
        <Input
          disabled
          value={`${window.location.origin}/view/${webinar.playbackId}`}
        />
      </label>
      <Discussion />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Info = styled.div``;

const Video = styled.video`
  width: 800px;
  margin-top: 50px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Status = styled.span`
  border: 1px solid ${({ isActive }) => (isActive ? "green" : "red")};
  padding: 10px;
  width: 100px;
  margin-left: 20px;
  text-align: center;
  border-radius: 20px;
  color: ${({ isActive }) => (isActive ? "green" : "red")};

  &::after {
    content: "${({ isActive }) => (isActive ? "Online" : "Not started")}";
  }
`;

const Input = styled.input`
  padding: 20px;
  margin-top: 50px;
  margin-left: 10px;
  width: 600px;
`;

export default WebinarSettings;
