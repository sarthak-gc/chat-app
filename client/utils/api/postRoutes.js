import axios, { AxiosError } from "axios";

// A general POST request function that accepts a body and a route.
const post = async (body, route) => {
  try {
    let token;
    if (!(route == "user/login" || route == "user/register")) {
      token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
    }

    console.log("hi");
    const response = await axios.post(
      `${import.meta.env.VITE_SOCKET_IO_URL}/${route}`,
      { body },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while making the POST request."
      );
    } else {
      throw new Error(
        "An unknown error occurred while making the POST request."
      );
    }
  }
};

export default post;
