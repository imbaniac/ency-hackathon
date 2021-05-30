import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Hls from "hls.js";
import styled from "styled-components";
import UserContext from "../../../utils/UserContext";
import { getStream } from "../../../api/stream";

const CreateWebinar = () => {
  const [webinar, setWebinar] = useState({});
  const { apiKey } = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const webinar = await getStream(apiKey, params.id);
      setWebinar(webinar.data);
    })();
  }, [apiKey, params.id]);

  useEffect(() => {
    let interval;
    if (params.id) {
      interval = setInterval(async () => {
        const webinar = await getStream(apiKey, params.id);
        setWebinar(webinar.data);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  });

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
      <Input
        disabled
        value={`${window.location.origin}/view/${webinar.playbackId}`}
      />
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
  width: 600px;
`;

export default CreateWebinar;
