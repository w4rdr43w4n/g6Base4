import { FC, useState } from "react";
import { literature } from "@/app/api/search_utils/literature_utils";
import "../styles/srch_components.css";
import { validateAuthors } from "@/app/lib/formVaild";
import { cfg } from "@/app/config/config";

interface props {
  onExit: (e: boolean) => void;
}
type Item = {
  title: string;
  authors: string;
  published: string;
  pdf_url: string;
  abstract: string;
};
const LiteraturePopup: FC<props> = ({ onExit }) => {
  // hooks
  const [statusText, setStatus] = useState("Generate");
  const [lrOutput, setLrOutput] = useState("");
  const [errorMessage, setMessage] = useState("");
  const [errorMessageAuthor, setMessageAuthor] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    pdf_url: "",
    published: "",
    abstract: "",
  });
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("apa");
  const [collectedItems, setCollectedItems] = useState<Item[]>([]);
  // Value Handlers

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    const { title, authors, published, pdf_url, abstract } = formData;
    if (
      title.trim().length !== 0 &&
      authors.trim().length !== 0 && // Check if authors array is not empty
      pdf_url.trim().length !== 0 &&
      published.trim().length !== 0 &&
      abstract.trim().length !== 0
    ) {
      setMessage("");
      const newData = {
        title: title,
        authors: authors,
        published: published,
        pdf_url: pdf_url,
        abstract: abstract,
      };
      if (!validateAuthors(newData.authors)) {
        setMessageAuthor("Invalid Author Names");
      } else {
        if (collectedItems.length >= cfg.lr_limit) {
          setMessage(
            `Sorry but currently you can only enter ${cfg.lr_limit} research for each generating attempt.`
          );
        } else {
          setCollectedItems((prevData) => [...prevData, newData]);
          setMessageAuthor("");
          // Clear the input values
          setFormData({
            title: "",
            authors: "",
            pdf_url: "",
            published: "",
            abstract: "",
          });

          setSubject("");
        }
      }
    } else {
      setMessage(
        "Please fill all feilds with required information to save it."
      );
    }
  };

  const handleExit = () => {
    onExit(false);
  };
  const handleSendData = async () => {
    try {
      const nonEmpty = collectedItems.filter(
        (ref) =>
          ref.title.trim().length !== 0 ||
          ref.authors.trim().length !== 0 || // Check if authors array is not empty
          ref.pdf_url.trim().length !== 0 ||
          ref.published.trim().length !== 0 ||
          ref.abstract.trim().length !== 0
      );
      // Create a new list of references with authors as arrays
      const data = nonEmpty.map((ref) => ({
        ...ref,
        authors: ref.authors.includes(",")
          ? ref.authors.split(",").map((author) => author.trim())
          : [ref.authors.trim()],
      }));
      if (data.length === 0) {
        setMessage(
          "Please enter and save some researches to generate a full literature review."
        );
      } else {
        setStatus("Generating...");
        setMessage("");
        const button: any = document.querySelector(".gener-btn");
        button.disabled = true;
        setLrOutput(
          "Generating a literature review from saved researches data..."
        );
        try {
          const response = await literature(data, style, subject);
          setLrOutput(response.data);
        } catch (err) {
          setLrOutput(
            "We're facing some traffic problems, please try again later"
          );
        }
        setStatus("Generate");
        button.disabled = false;
        setCollectedItems([]);
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };
  return (
    <section className="custom-lr">
      <section className="custom-lr-data">
        <h1>Saved Data</h1>
        <ul className="output-lr">
          <p className="error-msg-popup">{errorMessage}</p>
          {collectedItems.map((_data, i) => (
            <li key={i}>Saved Data item: {i + 1}</li>
          ))}
        </ul>
      </section>
      <section className="custom-lr-data">
        <h1>Literature Review</h1>
        <label htmlFor="subject">Subject</label>
        <input
          name="subject"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Science"
        />
        <label htmlFor="title">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleDataChange}
          placeholder="Fourier Conversion"
        />
        <label htmlFor="authors">
          Authors <span className="error-msg-popup">{errorMessageAuthor}</span>
        </label>
        <input
          name="authors"
          value={formData.authors}
          onChange={handleDataChange}
          placeholder="John Doe, Frank Tom"
        />
        <label htmlFor="published">Publish Year</label>
        <input
          name="published"
          value={formData.published}
          onChange={handleDataChange}
          placeholder="2011"
          type="number"
          min="1905"
          max="2100"
        />
        <label htmlFor="pdf_url">PDF url</label>
        <input
          name="pdf_url"
          value={formData.pdf_url}
          onChange={handleDataChange}
          placeholder="http://website.com/file.pdf"
        />
        <label htmlFor="abstract">Abstract</label>
        <textarea
          className="abstract-lr"
          name="abstract"
          value={formData.abstract}
          onChange={handleDataChange}
          placeholder="Abstract"
        ></textarea>

        <select
          onChange={handleSelectedStyle}
          value={style}
          className="cite-lr"
        >
          <option value="apa">APA</option>
          <option value="ieee">IEEE</option>
          <option value="mla">MLA</option>
          <option value="ama">AMA</option>
          <option value="asa">ASA</option>
          <option value="aaa">AAA</option>
          <option value="apsa">APSA</option>
          <option value="mhra">MHRA</option>
          <option value="oscola">OSCOLA</option>
        </select>
        <section>
          <button onClick={handleSave}>Save</button>
          <button className="gener-btn" onClick={handleSendData}>
            {statusText}
          </button>
        </section>
        <button className="exit-lr-btn" onClick={handleExit}>
          EXIT
        </button>
      </section>
      <section className="custom-lr-data">
        <h1>Output</h1>
        <p className="output-lr">{lrOutput}</p>
      </section>
    </section>
  );
};

export default LiteraturePopup;
