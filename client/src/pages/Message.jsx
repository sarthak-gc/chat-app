import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserNav from "../components/UserNav";
import ChatArea from "../components/ChatArea";

const Message = () => {
  const { socket, setChattedUsers, chattedUsers } = useOutletContext();
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  if (!user) {
    console.error("No user provided");
    navigate("/feed");
    return;
  }

  return (
    <div className="h-screen flex flex-col w-full bg-red-500">
      <UserNav userId={user._id} username={user.username} />
      <ChatArea
        socket={socket}
        receiver={user}
        setChattedUsers={setChattedUsers}
        chattedUsers={chattedUsers}
      />
    </div>
  );
};

export default Message;
