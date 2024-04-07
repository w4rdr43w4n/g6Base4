import { FC, useState, useEffect } from "react";
import { article, outline } from "@/app/api/search_utils/literature_utils";
import "../styles/srch_components.css";

interface props {
  query: string;
}

const Article: FC<props> = ({ query }) => {
  const [lrOutput, setLrOutput] = useState("");
  const [generating, setGenerateState] = useState<boolean>(false);
  const [statusText1, setStatus1] = useState("Generate");
  const [statusText2, setStatus2] = useState("Generate Outline");
  const [outTriggr, setOutTrigger] = useState(false);
  const [outlinee, setGenerateoutline] = useState<boolean>(false);
  const [outline_o, setOut] = useState("");
  const [isarxiv, setIsarxiv] = useState<boolean>(false);
  const [refs, setRefs] = useState([]);
  const handleGenerateButton = () => {
    setLrOutput("");
    setGenerateState(true);
  };
  const handleGenerateoutlie = () => {
    setLrOutput("");
    setGenerateoutline(true);
  };
  /*
  const handleKeyDown = (event: React.KeyboardEvent) => {
    console.log("uiooi");
    //setLrOutput(event.currentTarget.textContent || '');
    setLrOutput(document?.querySelector('.output-lr')?.textContent)
    console.log(lrOutput);
 };*/
  const handleEditorChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    const value = event.target.textContent || "";
    if (outTriggr) {
      setOut(value);
    }
  };

  useEffect(() => {
    try {
      if (generating) {
        const fetchLR = async () => {
          if (query.length === 0) {
            setLrOutput("Please write a topic in search bar of search tools!");
          } else {
            setStatus1("Generating...");
            setLrOutput(`Writing an article about the topic ${query} ...`);
            const button: any = document.querySelector(".art-btn");
            button.disabled = true;
            try{
            const response = await article(query, refs, outline_o, isarxiv);
            setLrOutput(response.data);
            
            } catch(err){
              setLrOutput("We're facing some traffic problems, please try again later")
              setGenerateState(false)
            }
            button.disabled = false
            setStatus1("Generate");
            setOut("");
            setIsarxiv(false);
          }
        };
        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setLrOutput(error.message);
      } else {
        setLrOutput("An unknown error occurred");
      }
    } finally {
      setGenerateState(false);
    }
  }, [generating, query, refs, outline_o, isarxiv, lrOutput]);
  useEffect(() => {
    try {
      if (outlinee) {
        const fetchLR = async () => {
          if (query.length === 0) {
            setLrOutput("Please write a topic in Search bar of search tools!");
          } else {
            const button: any = document.querySelector(".out-btn");
            button.disabled = true;
            setStatus2("Generating...");
            setLrOutput(`Creating an outline for the topic ${query} ...`);
            
            try{
              const response = await outline(query);
              setLrOutput(response.data);
              setLrOutput(response.data.outline);
              setOut(response.data.outline);
              setRefs(response.data.refs);
              setIsarxiv(response.data.arxiv);
              setOutTrigger(true);
              } catch(err){
                setLrOutput("We're facing some traffic problems, please try again later")
                setGenerateState(false)
              }
            setStatus2("Generate Outline");
            button.disabled = false;
          }
        };
        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setLrOutput(error.message);
      } else {
        setLrOutput("An unknown error occurred");
      }
    } finally {
      setGenerateoutline(false);
    }
  }, [outlinee, query, refs, isarxiv]);
  return (
    <>
      <h1>Article</h1>
      <section>
        <button className="art-btn" onClick={handleGenerateButton}>
          {statusText1}
        </button>
        <button className="out-btn" onClick={handleGenerateoutlie}>
          {statusText2}
        </button>
      </section>
      <div
        className="output-lr"
        onInput={handleEditorChange}
        contentEditable="true"
        suppressContentEditableWarning
      >
        {lrOutput}
      </div>
    </>
  );
};

export default Article;
