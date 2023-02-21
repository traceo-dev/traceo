import React from "react";
import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL);
export const SocketContext = React.createContext({ socket });
