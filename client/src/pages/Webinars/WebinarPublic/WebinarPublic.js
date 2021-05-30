import { useEffect } from "react";
import { useParams } from "react-router";
import Hls from "hls.js";
import styled from "styled-components";
import { Client, PrivateKey, ThreadID } from "@textile/hub";
import Discussion from "./Discussion";

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

const WebinarPublic = () => {
  const params = useParams();

  useEffect(() => {
    if (params.playbackId) {
      const video = document.getElementById("video");
      const videoSrc = `https://cdn.livepeer.com/hls/${params.playbackId}/index.m3u8`;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      }
    }

    (async () => {
      const threadId = localStorage.getItem(params.id);
      console.log("CURRENT THREAD", threadId);

      const user = await getIdentity();
      const client = await authorize(keyInfo, user);

      const info = await getInfo(
        client,
        ThreadID.fromString(
          "bafkz645fsv3d6dl6otoxtsy4wxzb2iozzhc2rn75qyu75cbufcdtqoq"
        )
      );
      console.log("CURRENT INFO", info);
    })();
  }, [params.playbackId]);

  return (
    <Container>
      <h2>Public Webinar</h2>
      <Video id="video" controls />
      <Discussion />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 50px;
`;

const Info = styled.div``;

const Video = styled.video`
  width: 800px;
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

export default WebinarPublic;
