const UserNav = ({ isTyping, username, userId }) => {
  return (
    <nav className="bg-[#24303f] w-full  text-white min-h-26 px-12  flex   items-center ">
      <ul className="flex gap-4  items-center ">
        <li className="bg-gray-600 flex items-center justify-center rounded-full w-12 h-12">
          <img
            src={`https://robohash.org/${userId}?set=set5&size=100x100`}
            alt={username[0].toUpperCase()}
            className="w-8 h-8 rounded-full "
          />
        </li>
        <div>
          <li>{username}</li>
          <li>{isTyping ? "typing..." : ""}</li>
        </div>
      </ul>
    </nav>
  );
};

export default UserNav;
