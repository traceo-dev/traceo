export enum WEB_SOCKET {
  CONNECTION = "connect",
  JOIN_ROOM = "join_room",
  SEND_CHAT_MESSAGE = "send_chat_message",
  EMIT_MESSAGE = "emit_message",
  UPDATE_CHATS_STATUS = "update_chats_status",
  SEND_TYPING_EVENT = "send_typing_event",
  RETRIEVE_TYPING_EVENT = "retrieve_typing_event",
  UPDATE_MESSAGES = "update_message"
}

export interface SendMessageSocketPayload {
  participants?: Participant[];
  authorId?: string;
  message?: string;
  chatId?: string;
  applicationId: string;
}

export interface SendTypingSocketPayload {
  chatId: string;
  isTyping: boolean;
  accountId: string;
}

interface Participant {
  id: string;
}
