import { useLocation, useNavigate } from "react-router-dom";

const GroupNav = ({ groupname, groupId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { group } = location.state;

  return (
    <nav className="bg-[#24303f] w-full  text-white min-h-26 px-12  flex   items-center ">
      <ul className="flex gap-4 justify-between w-full">
        <div className="flex gap-4  items-center">
          <li className="bg-gray-600 flex items-center justify-center rounded-full w-12 h-12">
            <img
              src={`https://robohash.org/${groupId}?set=set5&size=100x100`}
              alt={groupname[0].toUpperCase()}
              className="w-8 h-8 rounded-full "
            />
          </li>
          <div>
            <li>{groupname}</li>
          </div>
        </div>

        <span
          className=" flex items-center justify-center"
          onClick={() => {
            navigate(`/feed/groups/${group.id}/detail`, { state: { group } });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </span>
      </ul>
    </nav>
  );
};

export default GroupNav;
