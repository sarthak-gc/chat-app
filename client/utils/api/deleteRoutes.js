import axios, { AxiosError } from "axios";

const del = async (route, params) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.delete(`http://localhost:3000/${route}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while deleting data."
      );
    } else {
      throw new Error("An unknown error occurred while deleting data.");
    }
  }
};

export default del;
