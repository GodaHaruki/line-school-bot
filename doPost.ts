import { JoinEvent, Message, MessageEvent, WebhookEvent, WebhookRequestBody } from "@line/bot-sdk"
import { handleMessageEvent, handleJoinEvent } from "./event/handleEvent"

function handleDoPost(evt: GoogleAppsScript.Events.DoPost){
  const body: WebhookRequestBody = JSON.parse(evt.postData.contents) as WebhookRequestBody

  body.events.forEach(webhookEvt => {
    switch(webhookEvt.type){
      case "message":
        handleMessageEvent(webhookEvt as MessageEvent)
        break
  
      case "join":
        handleJoinEvent(webhookEvt as JoinEvent)
        break
  
      case "follow":
        break
  
      case "memberJoined":
        break
      
      case "memberLeft":
        break
    }
  })
}

export default handleDoPost;