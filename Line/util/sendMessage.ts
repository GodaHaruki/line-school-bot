import { type Message } from '@line/bot-sdk'
import { MESSAGING_API_PREFIX } from '@line/bot-sdk/dist/endpoints'
import getScriptEnv from '../../env'

type Messages = Message | [Message] | [Message, Message] | [Message, Message, Message]

// curl -v -X POST https://api.line.me/v2/bot/message/reply \
// -H 'Content-Type: application/json' \
// -H 'Authorization: Bearer {channel access token}' \
// -d '{
//     "replyToken":"nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
//     "messages":[
//         {
//             "type":"text",
//             "text":"Hello, user"
//         },
//         {
//             "type":"text",
//             "text":"May I help you?"
//         }
//     ]
// }'

function sendMessageWithReplyApi (msgs: Messages, replyToken: string) {
  const url = MESSAGING_API_PREFIX + '/message/push'

  const msg = Array.isArray(msgs)
    ? msgs
    : [msgs]

  return UrlFetchApp.fetch(url, {
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${getScriptEnv().LINE_CHANNEL_ACCESS_TOKEN}`
    },
    method: 'post',
    payload: {
      replyToken,
      messages: msg
    }
  })
}

// curl -v -X POST https://api.line.me/v2/bot/message/push \
// -H 'Content-Type: application/json' \
// -H 'Authorization: Bearer {channel access token}' \
// -H 'X-Line-Retry-Key: {UUID}' \
// -d '{
//     "to": "U4af4980629...",
//     "messages":[
//         {
//             "type":"text",
//             "text":"Hello, world1"
//         },
//         {
//             "type":"text",
//             "text":"Hello, world2"
//         }
//     ]
// }'

function sendMessageWithPushApi (msgs: Messages, to: string) {
  const url = MESSAGING_API_PREFIX + '/message/push'

  const msg = Array.isArray(msgs)
    ? msgs
    : [msgs] // if msgs == Message, convert to [Message]

  return UrlFetchApp.fetch(url, {
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${getScriptEnv().LINE_CHANNEL_ACCESS_TOKEN}`
    },
    method: 'post',
    payload: {
      to,
      messages: msg
    }
  })
}

async function sendMessage (msgs: Messages, to?: string, replyToken?: string) {
  if (replyToken) {
    return sendMessageWithReplyApi(msgs, replyToken)
  } else if (to) {
    return sendMessageWithPushApi(msgs, to)
  } else { // to = null, replyToken = null
    throw TypeError('set value either to or replyToken')
  }
}

export default sendMessage
