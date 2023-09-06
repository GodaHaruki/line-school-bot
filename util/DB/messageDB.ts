import { type MessageEvent } from "@line/bot-sdk";
import KVDB from "./KVDB";

class MessageDB extends KVDB<string, MessageEvent> {
  constructor(id: string, spreadsheetId?: string) {
    super(`message-${id}`, spreadsheetId);
  }
}

export default MessageDB;
