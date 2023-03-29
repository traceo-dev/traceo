import { useCallback, useContext } from "react";
import { SocketContext, SocketContextType } from "../contexts/LiveContextProvider";

export const useLive = () => {
  const context = useContext<SocketContextType>(SocketContext);

  if (!context) {
    console.warn(
      "Socket connection not found. Make sure to wrap your project with SocketContextProvider."
    );
  }

  const socket = context.socket;

  const subscribe = useCallback(
    (id: string) => {
      if (socket) {
        socket.emit("subscribe_app", { id });
      }
    },
    [socket]
  );

  const emit = useCallback(
    (ev: string, data?: object) => {
      if (socket) {
        socket.emit(ev, data);
      }
    },
    [socket]
  );

  const listen = useCallback(
    (ev: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.off(ev).on(ev, callback);
      }
    },
    [socket]
  );

  return {
    subscribe,
    emit,
    listen
  };
};
