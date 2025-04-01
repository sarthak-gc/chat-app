import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_IO_URL;
const socket = io(URL);

export default socket;
