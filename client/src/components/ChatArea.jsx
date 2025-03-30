import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import UserContext from "../context/UserDetails";
import get from "../../utils/api/getRoutes";

const ChatArea = () => {
  const textareaRef = useRef(null);
  const { setChattedUsers, socket } = useOutletContext();
  const sender = useContext(UserContext);
  const [messagesCollection, setMessagesCollection] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { user } = location.state || {};
  const messagesEndRef = useRef(null);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);
  useEffect(() => {
    const getOldMessages = async () => {
      // format :
      // createdAt: "2025-03-26T15:21:06.774Z"
      // message: "from sarthak1234 to testing"
      // receiver: "67e200fd9b76a31b9c64b075"
      // sender: "67e200659b76a31b9c64b06d"
      // status: "Sent"
      // updatedAt: "2025-03-26T15:21:06.774Z"
      const res = await get(`message/${user._id}`);
      setMessagesCollection(res.data.messages);
    };
    getOldMessages();
  }, [user._id]);
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", localStorage.getItem("token"), socket.id);
    });

    socket.on("new-message", (messageInfo) => {
      if (messageInfo.sender._id === user._id)
        setMessagesCollection((prev) => {
          return [
            ...prev,
            {
              message: messageInfo.message,
              sender: messageInfo.sender.senderId,
              receiver: sender.id,
              status: "Sent",
            },
          ];
        });

      const newUser = {
        username: messageInfo.sender.username,
        _id: messageInfo.sender._id,
      };

      setChattedUsers((prev) => {
        const userExists = prev.some((user) => user._id === newUser._id);
        if (!userExists) {
          return [...prev, newUser];
        }
        return prev;
      });
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("new-message");
      }
    };
  }, [socket, sender.id]);

  const handleMessageSend = () => {
    const receiverId = user._id;
    const senderId = sender.id;
    if (!message.trim()) {
      console.log("no message");
      setMessage("");

      return;
    }
    socket.emit("message", senderId, message, receiverId);

    const newUser = {
      username: user.username,
      _id: receiverId,
    };

    setChattedUsers((prev) => {
      const userExists = prev.some((user) => user._id === newUser._id);
      if (!userExists) {
        return [...prev, newUser];
      }
      return prev;
    });

    setMessagesCollection((prev) => {
      return [
        ...prev,
        { message, sender: senderId, receiver: receiverId, status: "Sent" },
      ];
    });
    setMessage("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesCollection]);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        textareaRef.current.blur();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleMessageSend();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [message]);

  return (
    <div className="flex flex-col relative h-[calc(100%-104px)] pb-14 bg-red-500">
      <div className="flex-grow overflow-auto  p-4 bg-[#121d2b]  text-white scrollbar-none">
        {messagesCollection.map((elem, index) => {
          const isLastMessage = index === messagesCollection.length - 1;
          return (
            <li
              key={index}
              ref={isLastMessage ? messagesEndRef : null}
              className={`w-full flex ${
                elem.sender === sender.id ? "justify-end" : "justify-start"
              } mb-2 text-white`}
            >
              <div className="w-fit relative   ">
                <div
                  className={`relative  py-1 rounded-2xl whitespace-pre-wrap break-words flex flex-col  ${
                    elem.sender === sender.id
                      ? "bg-[#486993] pl-5"
                      : "bg-[#24303f] pl-5"
                  } mb-2  `}
                >
                  <p>{elem.message}</p>

                  <div className="flex  items-center">
                    <span>
                      {elem.createdAt
                        ? new Date(elem.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </span>

                    {elem.status === "Sent" && (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="36"
                          height="20"
                          fill="rgb(158,179,201)"
                        >
                          <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                        </svg>
                      </span>
                    )}
                    {elem.status === "Delivered" && (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="36"
                          height="20"
                          fill="rgb(158,179,201)"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                      </span>
                    )}
                    {elem.status === "Read" && (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          height="20"
                          width="36"
                          fill="rgb(70,131,197)"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 bg-transparent absolute  bottom-4 ${
                    elem.sender === sender.id
                      ? "-right-1  rotate-60"
                      : "-left-1 rotate-[-60deg]"
                  }`}
                >
                  <div
                    className={`w-full h-full ${
                      elem.sender === sender.id
                        ? "bg-[hsl(214,34%,43%)]"
                        : "bg-[#24303f]"
                    }`}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </div>
      <div className="flex items-center bg-[#121d2b] text-white bottom-0  absolute  w-full  min-h-14 px-10 border-t  border-gray-400 ">
        <textarea
          ref={textareaRef}
          onChange={(e) => {
            handleChange(e);
          }}
          placeholder="Type a message..."
          className="w-full p-3 resize-none outline-none min-h-14 max-h-[50vh] overflow-y-scroll pr-6 text-justify scrollbar-none transition-height duration-900 ease-in-out"
          rows="1"
          value={message}
        />
        {message ? (
          <button
            className="absolute right-4 bottom-1"
            onClick={handleMessageSend}
          >
            <svg
              className="size-12  p-2.5 "
              viewBox="0 0 24 24"
              fill="#55a4f8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.2111 2.06722L3.70001 5.94499C1.63843 6.46039 1.38108 9.28612 3.31563 10.1655L8.09467 12.3378C9.07447 12.7831 10.1351 12.944 11.1658 12.8342C11.056 13.8649 11.2168 14.9255 11.6622 15.9053L13.8345 20.6843C14.7139 22.6189 17.5396 22.3615 18.055 20.3L21.9327 4.78886C22.3437 3.14517 20.8548 1.6563 19.2111 2.06722ZM8.92228 10.517C9.85936 10.943 10.9082 10.9755 11.8474 10.6424C12.2024 10.5165 12.5417 10.3383 12.8534 10.1094C12.8968 10.0775 12.9397 10.0446 12.982 10.0108L15.2708 8.17974C15.6351 7.88831 16.1117 8.36491 15.8202 8.7292L13.9892 11.018C13.9553 11.0603 13.9225 11.1032 13.8906 11.1466C13.6617 11.4583 13.4835 11.7976 13.3576 12.1526C13.0244 13.0918 13.057 14.1406 13.4829 15.0777L15.6552 19.8567C15.751 20.0673 16.0586 20.0393 16.1147 19.8149L19.9925 4.30379C20.0372 4.12485 19.8751 3.96277 19.6962 4.00751L4.18509 7.88528C3.96065 7.94138 3.93264 8.249 4.14324 8.34473L8.92228 10.517Z"
              />
            </svg>
          </button>
        ) : (
          <button className="absolute left-0 bottom-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#55a4f8"
              className="size-12  p-2.5 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
