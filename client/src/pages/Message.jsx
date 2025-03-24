import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserNav from "../components/UserNav";
import ChatArea from "../components/ChatArea";

const Message = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  if (!user) {
    console.error("No user provided");
    navigate("/*");
    return;
  }

  const isTyping = true;
  return (
    <div className="flex w-[100vw] bg-black ">
      <div className="w-96 flex-none">
        <Sidebar />
      </div>

      <div className="h-screen flex flex-col w-full">
        <UserNav
          userId={user._id}
          username={user.username}
          isTyping={isTyping}
        />
        <ChatArea />
      </div>
    </div>
  );
};

export default Message;
