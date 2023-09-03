import { AudioEventMessage, FileEventMessage, Group, ImageEventMessage, LocationEventMessage, MessageEvent, StickerEventMessage, TextEventMessage, TextMessage, VideoEventMessage } from "@line/bot-sdk";
import MessageDB from "../../DB/util/messageDB";
import sendMessage from "../../Line/util/sendMessage";

async function handleMessageEvent(evt: MessageEvent){
  const db = evt.source.type == "user" 
  ? new MessageDB(evt.source.userId) 
  : new MessageDB((evt.source as Group).groupId)

  db.push(evt.timestamp.toString(), evt)

  switch(evt.message.type){
    case "text":
      const text = evt.message as TextEventMessage
      const msg: TextMessage = {
        type: "text",
        text: text.text,
      }

      sendMessage([msg], evt.replyToken)
      .then(res => Logger.log(res.getResponseCode()))
      break

    case "image":
      const image = evt.message as ImageEventMessage
      break
    
    case "video":
      const video = evt.message as VideoEventMessage
      break
    
    case "audio":
      const audio = evt.message as AudioEventMessage
      break
    
    case "location":
      const location = evt.message as LocationEventMessage
      break

    case "file":
      const file = evt.message as FileEventMessage
      break
    
    case "sticker":
      const sticker = evt.message as StickerEventMessage
      break
  }
}

export default handleMessageEvent;