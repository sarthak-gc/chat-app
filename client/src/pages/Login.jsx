import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import iconPath from "../../assets/icon.svg";
import post from "../../utils/api/postRoutes";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await post(loginData, "user/login");
      localStorage.setItem("token", res.data.token);
      if (res.status === "success") {
        navigate("/feed");
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-3/5 lg:w-1/2 2xl:w-1/3 "
        onSubmit={(e) => handleLogin(e)}
      >
        <img src={iconPath} alt="Icon" className="w-20 h-20 mx-auto mb-6" />
        <h2 className="text-center text-2xl font-light text-gray-800 mb-4">
          jMessage
        </h2>
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign in with your account
        </h1>

        <Link
          to="/learn-more"
          className="text-blue-500 text-sm text-center block mb-6"
        >
          Learn more about jMessage
        </Link>

        <div className="w-full flex flex-col items-center">
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Username</span>
            <input
              type="text"
              placeholder="john_doe"
              className="outline-none flex-grow"
              onChange={(e) => {
                setLoginData({ ...loginData, username: e.target.value.trim() });
              }}
            />
          </div>
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Password</span>
            <input
              type="password"
              placeholder="required"
              className="outline-none flex-grow"
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value.trim() });
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit py-3 text-[#b8b8b8] mx-auto block text-3xl cursor-pointer"
        >
          Login...
        </button>

        <Link
          to="/register"
          className="text-blue-500 text-center block mt-4 text-sm"
        >
          Create new account
        </Link>
      </form>
    </div>
  );
};

export default Login;
