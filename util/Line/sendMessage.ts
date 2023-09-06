import { type Message } from "@line/bot-sdk";
import getScriptEnv from "../env";

type Messages =
  | Message
  | [Message]
  | [Message, Message]
  | [Message, Message, Message];

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

export async function sendMessageWithReplyApi(
  msgs: Messages,
  replyToken: string
): Promise<GoogleAppsScript.URL_Fetch.HTTPResponse> {
  const url = "https://api.line.me/v2/bot/message/reply";

  const msg = Array.isArray(msgs) ? msgs : [msgs];

  return UrlFetchApp.fetch(url, {
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${getScriptEnv().LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken,
      messages: msg,
    }),
  });
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

export async function sendMessageWithPushApi(
  msgs: Messages,
  to: string
): Promise<GoogleAppsScript.URL_Fetch.HTTPResponse> {
  const url = "https://api.line.me/v2/bot/message/push";

  const msg = Array.isArray(msgs) ? msgs : [msgs]; // if msgs == Message, convert to [Message]

  return UrlFetchApp.fetch(url, {
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${getScriptEnv().LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    method: "post",
    payload: JSON.stringify({
      to,
      messages: msg,
    }),
  });
}
