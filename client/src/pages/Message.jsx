import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserNav from "../components/UserNav";
import ChatArea from "../components/ChatArea";

const Message = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  if (!user) {
    // console.error("No user provided");
    // navigate("/feed);
    return;
  }
  const isTyping = true;
  console.log(isTyping);
  return (
    <div className="h-screen flex flex-col w-full">
      <UserNav
        userId={user._id}
        // userId={"123"}
        username={user.username}
        isTyping={isTyping}
      />
      <ChatArea />
    </div>
  );
};

export default Message;
