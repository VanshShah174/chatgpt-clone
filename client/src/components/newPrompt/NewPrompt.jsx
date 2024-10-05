import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown"

const NewPrompt = () => {
  const[question,setQuestion] = useState("")
  const[answer,setAnswer] = useState("")
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData:{},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question,answer, img.dbData]);

  const add = async (text) => {
    setQuestion(text)

    const result = await model.generateContent(
      Object.entries(img.aiData).length ? [img.aiData,text] : [text] 
    );
    const response = await result.response;
    setAnswer(response.text())
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData:{},
    })
  };


  const handleSubmit = async (e) =>{
    e.preventDefault()

    const text = e.target.text.value;
    add(text)
  }

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="">Loading.....</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && <div className="message"><Markdown>{answer}</Markdown></div>}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input type="file" id="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything......" />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
