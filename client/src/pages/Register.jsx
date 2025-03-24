import React from "react";
import { Link } from "react-router-dom";
import iconPath from "../../assets/icon.svg";

const Register = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-3/5 lg:w-1/2 2xl:w-1/3">
        {/* Icon */}
        <img src={iconPath} alt="Icon" className="w-20 h-20 mx-auto mb-6" />

        {/* jMessage Title */}
        <h2 className="text-center text-2xl font-light text-gray-800 mb-4">
          jMessage
        </h2>

        {/* Main Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create your new account
        </h1>

        {/* Learn More Link */}
        <Link
          to="/learn-more"
          className="text-blue-500 text-sm text-center block mb-6"
        >
          Learn more about jMessage
        </Link>

        {/* Input Fields */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Username</span>
            <input
              type="text"
              placeholder="john_doe"
              className="outline-none flex-grow"
            />
          </div>
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Password</span>
            <input
              type="password"
              placeholder="required"
              className="outline-none flex-grow"
            />
          </div>
          <div className="w-full lg:w-3/4 p-4 text-gray-800 border border-t-none border-[#efefef] rounded-b-lg gap-4 flex">
            <span className="w-1/4 flex-shrink-0">Confirm</span>
            <input
              type="password"
              placeholder="confirm password"
              className="outline-none flex-grow"
            />
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-fit py-3 text-[#b8b8b8] mx-auto block text-3xl cursor-pointer"
        >
          Register...
        </button>

        {/* Login Link */}
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
