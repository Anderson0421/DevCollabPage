import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [token, setToken] = useState(null);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [username,setUsername] = useState("");
  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    setToken(storedToken);
    const storedUsername = window.localStorage.getItem("user");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (isMicrophoneOn && countdown > 0) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown <= 0) {
      mediaRecorderRef.current?.stop();
      setIsMicrophoneOn(false);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isMicrophoneOn, countdown]);

  const handleChat = async (audioText = "") => {
    const messageContent = typeof audioText === 'string' ? audioText : userInput;
    if (!messageContent.trim()) return; // No enviar mensajes vacíos

    setUserInput("");
    setMessages([...messages, { role: "user", content: messageContent }]);

    setIsTyping(true);
    setTimeout(async () => {
      try {
        const chatResponse = await axios.post(
          "https://chatbot-api-2tzx.onrender.com/chat",
          {
            system_prompt: "Tu sistema prompt aquí",
            user_prompt: messageContent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseText = chatResponse.data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: responseText },
        ]);

        await axios.post(
          "https://chatbot-api-2tzx.onrender.com/speak",
          { text: responseText },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setIsTyping(false);
      } catch (error) {
        const errorMessage = error.response?.status === 403
          ? "Has alcanzado el límite de usos del chatbot."
          : "Hubo un error al procesar tu solicitud.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: errorMessage },
        ]);
      }
    }, 500);
  };

  if (!token) {
    return null;
  }

  const handleMicrophoneToggle = () => {
    if (isMicrophoneOn) {
      mediaRecorderRef.current.stop();
      setIsMicrophoneOn(false);
      clearInterval(intervalRef.current);
      setIsButtonDisabled(true);
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
          mediaRecorderRef.current = mediaRecorder;

          const audioChunks = [];
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            try {
              const response = await axios.post(
                "https://chatbot-api-2tzx.onrender.com/talk",
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (response.status === 200) {
                handleChat(response.data.text);
              } else {
                console.error("Error:", response.data.error);
              }
            } catch (error) {
              const errorMessage = error.response?.status === 403
              ? "Has alcanzado el límite de usos del chatbot."
              : "Hubo un error al procesar tu solicitud.";
              setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: errorMessage },
              ]);
            } finally {
              setIsButtonDisabled(false);
            }
          };

          mediaRecorder.start();
          setIsMicrophoneOn(true);
          setCountdown(10);
          setIsButtonDisabled(true); 
        })
        .catch((error) => {
          console.error("Error al acceder al micrófono:", error);
        });
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-full max-w-md bg-gray-800 text-white rounded-lg shadow-xl ${
        isOpen ? "h-[400px]" : "h-16"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 flex justify-between items-center bg-purple-900 rounded-t-lg shadow-md focus:outline-none"
        >
          <h2 className="text-xl font-semibold text-white">Chatbot</h2>
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {isOpen && (
          <>
            <div className="flex-grow overflow-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-purple-700 text-right"
                      : "bg-gray-700 text-left"
                  } shadow-md`}
                >
                  <p className="font-semibold text-sm">
                    {msg.role === "user" ? username||"" : "Asistente"}:
                  </p>
                  <p className="mt-1">{msg.content}</p>
                </div>
              ))}
              {isTyping && (
                <div className="p-3 rounded-lg bg-gray-600 text-center text-gray-300 shadow-md flex items-center justify-center space-x-2">
                  <p className="mr-2">Escribiendo</p>
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex p-4 bg-gray-900 rounded-b-lg border-t border-gray-700">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow p-2 bg-gray-800 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-purple-500 transition duration-300"
                placeholder="Escribe tu mensaje..."
              />
              <div className="relative inline-block">
                <button
                  onClick={handleMicrophoneToggle}
                  className={`mx-2 ${
                    isMicrophoneOn
                      ? "bg-purple-800 hover:bg-purple-900"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white font-semibold py-2 px-4 rounded-lg transition duration-300`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      d={`M${
                        isMicrophoneOn
                          ? "15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z"
                          : "19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z"
                      }`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isMicrophoneOn && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-700 text-white text-xs font-bold py-1 px-2 rounded-lg">
                    {countdown}
                  </div>
                )}
              </div>
              <button
                onClick={handleChat}
                className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
