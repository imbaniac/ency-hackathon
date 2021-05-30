import EditorJS from "@editorjs/editorjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Buckets, PrivateKey } from "@textile/hub";

function App() {
  const [editor, setEditor] = useState(null);
  const [currentIdentity, setCurrentIdentity] = useState(null);

  useEffect(() => {
    const editorInstance = new EditorJS("editorjs");
    setEditor(editorInstance);

    setup();
  }, []);

  const setup = async () => {
    const identity = await getIdentity();
    setCurrentIdentity(identity);
    const { bucketKey, buckets } = await getBucketKey();
    console.log("BUCKETS", bucketKey, buckets);
  };

  const getIdentity = async () => {
    try {
      const storedIdent = localStorage.getItem("identity");
      if (storedIdent === null) {
        throw new Error("No identity");
      }
      const restored = PrivateKey.fromString(storedIdent);
      return restored;
    } catch (e) {
      /**
       * If any error, create a new identity.
       */
      try {
        const identity = PrivateKey.fromRandom();
        const identityString = identity.toString();
        localStorage.setItem("identity", identityString);
        return identity;
      } catch (err) {
        return err.message;
      }
    }
  };

  const getBucketKey = async () => {
    if (!currentIdentity) {
      throw new Error("Identity not set");
    }
    // const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions);
    // await buckets.getToken(currentIdentity);

    // const buck = await buckets.getOrCreate("co.ency.editor");
    // if (!buck.root) {
    //   throw new Error("Failed to open bucket");
    // }
    // return { buckets: buckets, bucketKey: buck.root.key };
  };

  const handleSave = () => {
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  return (
    <Container>
      <Navbar>
        {currentIdentity ? currentIdentity.toString() : "Loading..."}
      </Navbar>
      <Header>Welcome to Ency</Header>
      <div id="editorjs" />
      <Button onClick={handleSave}>Save</Button>
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto;
  width: 800px;
  background: white;
  height: 100%;
  padding: 20px;
`;

const Header = styled.h1`
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  background: white;
`;

const Navbar = styled.div``;

export default App;
