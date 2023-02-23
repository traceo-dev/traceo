import React, { FC, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket;
}

export const SocketContext = React.createContext<SocketContextType>(null);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000/";

export const LiveContextProvider: FC = ({ children }) => {
  const socket = useRef(
    io(SOCKET_URL, {
      transports: ["websocket"]
    })
  );

  useEffect(() => {
    socket.current.on("disconnect", removeConnection);

    return () => {
      if (socket && socket.current) {
        removeConnection();
      }
    };
  }, []);

  const removeConnection = () => {
    socket.current.removeAllListeners();
    socket.current.disconnect();
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
