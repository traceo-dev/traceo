import { socket } from "src/core/hooks/SocketContextProvider";
import {
  SendMessageSocketPayload,
  SendTypingSocketPayload,
  WEB_SOCKET
} from "src/types/webSocket";

const sendChatMessage = (socketPayload: SendMessageSocketPayload) => {
  socket.emit(WEB_SOCKET.SEND_CHAT_MESSAGE, socketPayload);
};

const sendTypingEvent = (socketPayload: SendTypingSocketPayload) => {
  socket.emit(WEB_SOCKET.SEND_TYPING_EVENT, socketPayload);
};

const webSocket = {
  sendChatMessage,
  sendTypingEvent
};

export default webSocket;
