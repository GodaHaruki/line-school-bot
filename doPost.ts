import { type JoinEvent, type MessageEvent, type WebhookRequestBody } from '@line/bot-sdk'
import { handleMessageEvent, handleJoinEvent } from './event/handleEvent'

function handleDoPost (evt: GoogleAppsScript.Events.DoPost) {
  const body: WebhookRequestBody = JSON.parse(evt.postData.contents) as WebhookRequestBody

  body.events.forEach(webhookEvt => {
    switch (webhookEvt.type) {
      case 'message':
        handleMessageEvent(webhookEvt)
          .catch(e => {
            throw Error(e)
          })
        break

      case 'join':
        handleJoinEvent(webhookEvt)
        break

      case 'follow':
        break

      case 'memberJoined':
        break

      case 'memberLeft':
        break
    }
  })
}

export default handleDoPost
