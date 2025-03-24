import React from "react";

const Welcome = () => {
  return (
    <div className="bg-[#24303f] h-screen  flex justify-center items-center w-full">
      <p className="text-white text-sm bg-[#1a212c] px-6 py-3 rounded-full text-center ">
        <span className="block mb-2">Welcome to jMessage!</span>
        <span>Select a chat to start messaging</span>
      </p>
    </div>
  );
};

export default Welcome;
