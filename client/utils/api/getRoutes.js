import axios, { AxiosError } from "axios";

const get = async (route, params) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`http://localhost:3000/${route}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while fetching data."
      );
    } else {
      console.log(err);
      throw new Error("An unknown error occurred while fetching data.");
    }
  }
};

export default get;
