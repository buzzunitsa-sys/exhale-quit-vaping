import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage } from "@shared/types";
// USER ENTITY: one DO instance per user (using email as ID)
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { 
    id: "", 
    email: "", 
    createdAt: 0 
  };
  // Removed seed data to prevent type conflicts and clean slate
}
// CHAT BOARD ENTITY: Kept for template compatibility
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}