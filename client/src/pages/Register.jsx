import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import iconPath from "../../assets/icon.svg";

import post from "../../utils/api/postRoutes";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Password didn't match");
      return;
    }
    try {
      const res = await post(registerData, "user/register");
      if (res.status === "success") {
        alert("Registration successful");
        navigate("/login");
        localStorage.setItem("token", res.data.token);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={(e) => {
          handleRegister(e);
        }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-3/5 lg:w-1/2 2xl:w-1/3"
      >
        <img src={iconPath} alt="Icon" className="w-20 h-20 mx-auto mb-6" />

        <h2 className="text-center text-2xl font-light text-gray-800 mb-4">
          jMessage
        </h2>

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create your new account
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
              value={registerData.username}
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  username: e.target.value.trim(),
                });
              }}
              className="outline-none flex-grow"
            />
          </div>
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Password</span>
            <input
              type="password"
              placeholder="required"
              value={registerData.password}
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  password: e.target.value.trim(),
                });
              }}
              className="outline-none flex-grow"
            />
          </div>
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] rounded-b-lg gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Confirm</span>
            <input
              type="password"
              placeholder="confirm password"
              value={registerData.confirmPassword}
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value.trim(),
                });
              }}
              className="outline-none flex-grow"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit py-3 text-[#b8b8b8] mx-auto block text-3xl cursor-pointer"
        >
          Register...
        </button>

        <Link
          to="/login"
          className="text-blue-500 text-center block mt-4 text-sm"
        >
          Already have an account? Log in
        </Link>
      </form>
    </div>
  );
};

export default Register;
