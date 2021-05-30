const CreateWebinar = () => {
  return (
    <>
      <h1>New Webinar</h1>
      <video-js
        id="vid1"
        width="600"
        height="300"
        className="vjs-default-skin"
        controls
      >
        <source
          src="https://example.com/index.m3u8"
          type="application/x-mpegURL"
        />
      </video-js>
    </>
  );
};

export default CreateWebinar;
