import { useEffect } from "react";
import { useParams } from "react-router";
import Hls from "hls.js";
import styled from "styled-components";

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
  }, [params.playbackId]);

  return (
    <Container>
      <Video id="video" controls />
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

export default WebinarPublic;
