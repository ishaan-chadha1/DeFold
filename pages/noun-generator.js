import { useState } from "react";
import axios from "axios";

export default function NounGenerator() {
  const [nounImg, setNounImg] = useState("");

  const fetchNoun = async () => {
    try {
      const response = await axios.get("/api/noun");
      setNounImg(response.data);
    } catch (error) {
      console.error("Error fetching Noun:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchNoun}>Get a Noun</button>
      {nounImg && (
        <div
          dangerouslySetInnerHTML={{ __html: nounImg }}
          style={{ width: "320px", height: "320px" }}
        ></div>
      )}
    </div>
  );
}
