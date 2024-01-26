"use client";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import { set } from "date-fns";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);
  const [isWaitingBot, setIsWaitingBot] = useState(false);

  // 新增狀態來保存選擇的文件
  const [selectedFile, setSelectedFile] = useState(null);

  // 文件選擇處理函數
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const startNewChat = () => {
    setMessages([]);
    setIsWaitingBot(false);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const errorResponse = (error) => {
    console.error("Error fetching response: ", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "Sorry, the system is currently busy. Please try again in a few moments.",
        sender: "bot",
      },
    ]);
  };

  const analyzeFile = async (e) => {
    setIsWaitingBot(true);
    console.log(
      "sendFile: ",
      selectedFile.name,
      "to: ",
      `${process.env.NEXT_PUBLIC_MAIN_FRAME_URL}/api/send_query`
    );

    e.preventDefault();

    // Add the user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input + " (file: " + selectedFile.name + ")", sender: "user" },
    ]);
    setInput("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAIN_FRAME_URL}/api/send_query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input, dataset: true }),
        }
      );
      // Parse the text from the response
      const botResponseText = await response.text();
      console.log("botResponse: ", botResponseText);
      // Add the bot response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponseText, sender: "bot" },
      ]);
    } catch (error) {
      errorResponse(error);
    } finally {
      setIsWaitingBot(false);
    }
  };

  const sendMessage = async (e) => {
    if (selectedFile) {
      analyzeFile(e);
      return;
    }

    setIsWaitingBot(true);
    console.log(
      "sendMessage: ",
      input,
      "to: ",
      `${process.env.NEXT_PUBLIC_MAIN_FRAME_URL}/api/send_query`
    );

    e.preventDefault();
    if (input.trim() === "") return;

    // Add the user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);
    setInput("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAIN_FRAME_URL}/api/send_query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the text from the response
      const botResponseText = await response.text();
      console.log("botResponse: ", botResponseText);

      // Add the bot response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponseText, sender: "bot" },
      ]);
    } catch (error) {
      errorResponse(error);
    } finally {
      setIsWaitingBot(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Chat with Bot</title>
      </Head>
      <section className="p-0">
        <div className="bg-white border-2 shadow-2xl rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="h-96 overflow-y-auto mb-4" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded px-4 py-2 text-white ${
                    message.sender === "user" ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isWaitingBot && (
              <div className="flex mb-2 justify-start">
                <div className="rounded px-4 py-2 text-white bg-gray-700">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              </div>
            )}
          </div>
          <div>
            {/* 文件上傳按鈕，設計為正方形並添加迴紋針圖案 */}
            <div className="flex items-center">
              <label
                htmlFor="file"
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-2 cursor-pointer"
              >
                <img
                  src="/images/paper_clip.png"
                  alt="Paper Clip"
                  className="w-6 h-6"
                />
                <input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <div className="text-sm text-gray-700 mr-2">
                  Attach: {selectedFile.name}
                </div>
              )}
            </div>
            <div className="p-0.5"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isWaitingBot) {
                  e.preventDefault(); // 阻止 Enter 鍵的默認行為（如換行）
                  sendMessage(e);
                }
              }}
              placeholder="Type your message here..."
              className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition ease-in-out rounded w-full p-2"
            />
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={sendMessage}
                disabled={isWaitingBot}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Submit
              </button>

              <button
                onClick={startNewChat}
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Start New Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
