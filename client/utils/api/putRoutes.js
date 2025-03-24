import axios, { AxiosError } from "axios";

const put = async ({ body, route }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.put(
      `http://localhost:3000/${route}`,
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
          "An error occurred while making the PUT request."
      );
    } else {
      throw new Error(
        "An unknown error occurred while making the PUT request."
      );
    }
  }
};

export default put;
