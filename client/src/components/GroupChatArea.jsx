import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserContext from "../context/UserDetails";
import get from "../../utils/api/getRoutes";

const GroupChatArea = () => {
  const textareaRef = useRef(null);
  const { socket } = useOutletContext();
  const sender = useContext(UserContext);
  const [messagesCollection, setMessagesCollection] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { group } = location.state || {};
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const getOldMessages = async () => {
      const res = await get(`message/group/${group._id}`, {
        groupId: group._id,
      });
      setMessagesCollection(res.data.messages);
    };
    getOldMessages();
  }, [group._id]);

  useEffect(() => {
    socket.emit("group-click", group._id, sender._id);
    socket.on("new-group-message", (messageInfo) => {
      if (messageInfo.sender !== sender.id) {
        setMessagesCollection((prev) => [
          ...prev,
          {
            message: messageInfo.message,
            sender: { _id: messageInfo.sender },
          },
        ]);
      }
    });

    return () => {
      if (socket) {
        socket.off("new-group-message");
      }
    };
  }, [socket, sender, messagesCollection]);

  const handleMessageSend = () => {
    const senderId = sender.id;

    const groupId = group._id;

    if (!message.trim()) {
      console.log("no message");
      setMessage("");
      return;
    }

    socket.emit("send-group-message", senderId, message, groupId);

    setMessagesCollection((prev) => [
      ...prev,
      { message, sender: { _id: senderId }, group: { _id: groupId } },
    ]);
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
    <div className="flex flex-col relative h-[calc(100%-104px)] pb-14 ">
      <div className="flex-grow overflow-auto p-4 bg-[#121d2b] text-white scrollbar-none">
        {messagesCollection.map((elem, index) => {
          const isLastMessage = index === messagesCollection.length - 1;

          return (
            <li
              key={index}
              ref={isLastMessage ? messagesEndRef : null}
              className={`w-full flex ${
                elem.sender._id === sender.id ? "justify-end" : "justify-start"
              } mb-2 text-white`}
            >
              <div className="flex  items-end  max-w-4/5">
                {elem.sender._id !== sender.id && (
                  <img
                    onClick={() => {
                      navigate(`/feed/users/${elem.sender._id}/detail`, {
                        state: { user: elem.sender },
                      });
                    }}
                    src={`https://robohash.org/${elem.sender._id}?set=set5&size=100x100`}
                    alt={elem.sender.username}
                    className={`w-8 h-8`}
                  />
                )}
                <div className="w-fit relative">
                  <div
                    className={`relative px-5 py-1 rounded-2xl whitespace-pre-wrap break-words flex flex-col  ${
                      elem.sender._id === sender.id
                        ? "bg-[#486993]"
                        : "bg-[#24303f]"
                    } mb-2`}
                  >
                    <p>{elem.message}</p>

                    <div className="flex items-center">
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
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 bg-transparent absolute bottom-4 ${
                      elem.sender._id === sender.id
                        ? "-right-1  rotate-60"
                        : "-left-1 rotate-[-60deg]"
                    }`}
                  >
                    <div
                      className={`w-full h-full ${
                        elem.sender._id === sender.id
                          ? "bg-[hsl(214,34%,43%)]"
                          : "bg-[#24303f]"
                      }`}
                    />
                  </div>
                </div>
                {elem.sender._id === sender.id && (
                  <img
                    onClick={() => {
                      navigate(`/feed/users/${elem.sender._id}/detail`, {
                        state: { user: elem.sender },
                      });
                    }}
                    src={`https://robohash.org/${elem.sender._id}?set=set5&size=100x100`}
                    alt={elem.sender.username}
                    className={`w-8 h-8`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </div>
      <div className="flex items-center bg-[#121d2b] text-white bottom-0  absolute w-full min-h-14 px-10 border-t border-gray-400 ">
        <textarea
          ref={textareaRef}
          onChange={(e) => {
            setMessage(e.target.value);
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

export default GroupChatArea;
