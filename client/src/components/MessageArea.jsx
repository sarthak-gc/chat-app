// import React, { useState } from "react";

// const MessageArea = ({ socket }) => {
//   socket.on("message", (message) => {
//     console.log(message);
//   });

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([
//     { sender: "John", content: "Hello!" },
//     { sender: "Jane", content: "Hi there!" },
//   ]);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       setMessages([...messages, { sender: "You", content: message }]);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-3 p-2 rounded-lg ${
//               msg.sender === "You"
//                 ? "bg-blue-100 text-right"
//                 : "bg-gray-100 text-left"
//             }`}
//           >
//             <span className="font-semibold">{msg.sender}: </span>
//             <span>{msg.content}</span>
//           </div>
//         ))}
//       </div>

//       <div className="p-4 bg-gray-100 border-t border-gray-300">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             className="flex-1 p-2 border rounded-lg"
//             placeholder="Type a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
//             disabled={!message.trim()}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageArea;

import React, { useEffect, useState } from "react";
import socket from "../socket.js";

const MessageArea = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
      if (!localStorage.getItem("socketId")) {
        localStorage.setItem("socketId", socket.id);
      }
      const socketId = localStorage.getItem("socketId");
      console.log(socketId);
      socket.emit("login", localStorage.getItem("token"), socketId);
    });
    socket.on("message", (message) => {
      console.log(message);
    });
    return () => {
      if (socket) {
        socket.off("connect");
      }
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleMessageSend = () => {
    socket.emit("message", message);
  };
  return (
    <div>
      <h1>SOCKET CLIENT</h1>
      <h1>Data : {message}</h1>
      <input
        onChange={(e) => handleChange(e)}
        type="text"
        name=""
        id=""
        value={message}
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

export default MessageArea;
