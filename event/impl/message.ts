import { type Group, type MessageEvent, type TextMessage } from "@line/bot-sdk";
import MessageDB from "../../DB/util/messageDB";
import { sendMessageWithReplyApi } from "../../Line/util/sendMessage";
import KVDB from "../../DB/KVDB";

interface Info {
  type: string;
}

interface Homeworks extends Info {
  type: "homework";
  date: number;
  content: string;
}

class AppDB extends KVDB<string, Homeworks> {
  constructor(id: string) {
    super(`App-${id}`);
  }
}

async function handleMessageEvent(evt: MessageEvent): Promise<void> {
  const db =
    evt.source.type === "user"
      ? new MessageDB(evt.source.userId)
      : new MessageDB((evt.source as Group).groupId);

  db.push(evt.timestamp.toString(), evt);

  switch (evt.message.type) {
    case "text":
      const text = evt.message;
      switch (text.text) {
        case "/homework":
          const homeworks =
            (evt.source.type) === "user"
              ? await new AppDB(evt.source.userId!).getAll()
              : await new AppDB((evt.source as Group).groupId).getAll();

          sendMessageWithReplyApi({
            type: "text",
            text: homeworks.map(h => h.content).join("/n")
          }, evt.replyToken);
      break;

    // case 'image':
    //   const image = evt.message as ImageEventMessage
    //   break

    // case 'video':
    //   const video = evt.message as VideoEventMessage
    //   break

    // case 'audio':
    //   const audio = evt.message as AudioEventMessage
    //   break

    // case 'location':
    //   const location = evt.message as LocationEventMessage
    //   break

    // case 'file':
    //   const file = evt.message as FileEventMessage
    //   break

    // case 'sticker':
    //   const sticker = evt.message as StickerEventMessage
    //   break
  }
}

export default handleMessageEvent;
