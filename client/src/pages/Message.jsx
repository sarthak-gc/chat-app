import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import UserNav from "../components/UserNav";
import ChatArea from "../components/ChatArea";
import GroupNav from "../components/GroupNav";
// import GroupChatArea from "../components/GroupChatArea";

const Message = () => {
  const { socket, setChattedUsers, chattedUsers } = useOutletContext();
  const location = useLocation();
  const { user } = location.state || {};
  const { group } = location.state || {};
  const navigate = useNavigate();
  if (!user && !group) {
    console.error("No destination provided");
    navigate("/feed");
  }

  return (
    <div className="h-screen flex flex-col w-full">
      {group && <GroupNav groupId={group._id} groupname={group.groupName} />}
      {/* {group && <GroupChatArea />} */}
      {user && <UserNav userId={user._id} username={user.username} />}
      {user && (
        <ChatArea
          socket={socket}
          receiver={user}
          setChattedUsers={setChattedUsers}
          chattedUsers={chattedUsers}
        />
      )}
    </div>
  );
};

export default Message;
