import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserNav from "../components/UserNav";
import ChatArea from "../components/ChatArea";

const Message = () => {
  const { socket } = useOutletContext();
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  if (!user) {
    console.error("No user provided");
    navigate("/feed");
    return;
  }

  return (
    <div className="h-screen flex flex-col w-full ">
      <UserNav userId={user._id} username={user.username} />
      <ChatArea socket={socket} receiver={user} />
    </div>
  );
};

export default Message;
