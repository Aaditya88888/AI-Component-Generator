import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({
    apiKey: `${import.meta.env.VITE_API_KEY}`,
  });

  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
       You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framework.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
    });
    console.log(response.text);

    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copies to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File download");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center px-5 lg:px-[100px] justify-between gap-[30px]">
        {/* Left Section */}
        <div className="left w-full lg:w-[50%] h-auto lg:h-[80vh] bg-[#141319] mt-5 p-[20px] rounded-xl">
          <h3 className="text-[22px] lg:text-[25px] font-semibold sp-text">
            AI component generator
          </h3>
          <p className="text-gray-400 mt-2 text-[14px] lg:text-[16px]">
            Describe your component and let AI code it for you.
          </p>
          <Select
            className="mt-2"
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                  ? "#222"
                  : "#111",
                color: "#fff",
                "&:active": { backgroundColor: "#444" },
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" }),
            }}
            onChange={(selected) => {
              setFrameWork(selected);
            }}
          />
          <p className="text-[14px] lg:text-[15px] font-[700] mt-5">
            Describe your component
          </p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[150px] lg:min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-3">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              Click on generate button to get your code
            </p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              {loading === true ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <BsStars />
              )}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative mt-5 lg:mt-2 w-full h-[60vh] lg:h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {outputScreen === false ? (
            <div className="w-full h-full flex items-center flex-col justify-center p-5 text-center">
              <div className="p-5 w-[60px] lg:w-[70px] h-[60px] lg:h-[70px] flex items-center justify-center text-[24px] lg:text-[30px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <HiOutlineCode />
              </div>
              <p className="text-[14px] lg:text-[16px] text-gray-400 mt-3">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="top w-full bg-[#17171c] h-[50px] lg:h-[60px] flex items-center gap[15px] px-[10px] lg:px-[20px]">
                <button
                  onClick={() => setTab(1)}
                  className={`btn w-1/2 p-[8px] lg:p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 1 ? "bg-[#333]" : ""
                  } `}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`btn w-1/2 p-[8px] lg:p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 2 ? "bg-[#333]" : ""
                  } `}
                >
                  Preview
                </button>
              </div>

              <div className="top-2 bg-[#17171C] w-full h-[50px] flex items-center justify-between px-3 lg:px-4">
                <div className="left">
                  <p className="font-bold text-gray-200 text-sm lg:text-base">
                    Code Editor
                  </p>
                </div>
                <div className="right flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <IoCopy />
                      </button>
                      <button
                        onClick={downloadFile}
                        className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsNewTabOpen(true);
                        }}
                        className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <ImNewTab />
                      </button>
                      <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]">
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="editor h-[calc(100%-110px)] lg:h-full">
                {tab === 1 ? (
                  <Editor
                    height="100%"
                    value={code}
                    theme="vs-dark"
                    language="html"
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    className="preview w-full h-full bg-white text-black flex items-center justify-center"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className="font-bold">Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="w-full h-[calc(100vh-60px)]"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
