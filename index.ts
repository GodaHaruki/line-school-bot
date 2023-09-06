import { WebhookRequestBody, MessageEvent, TextMessage } from "@line/bot-sdk";
import WebhookHandlers from "./webhookHandler/webhookHandler";
import { sendMessageWithReplyApi } from "./util/Line/sendMessage";

function doGet(e: GoogleAppsScript.Events.DoGet): void {}

function doPost(e: GoogleAppsScript.Events.DoPost): void {
  const webhookEvent: WebhookRequestBody = JSON.parse(
    e.postData.contents
  ) as WebhookRequestBody;

  const handler = new WebhookHandlers();

  handler.message = async (evt: MessageEvent) => {
    // オウムがえし
    const msg: TextMessage = {
      type: "text",
      text:
        evt.message.type === "text"
          ? evt.message.text
          : "non-text is not supported",
    };

    sendMessageWithReplyApi(msg, evt.replyToken);
    // to use sendMessage function, you have to set LINE_CHANNEL_ACCESS_TOKEN at GAS Editer
    // you can set TOKEN at PropertieService
  };

  handler.handle(webhookEvent);
}

declare let global: any;

global.doPost = doPost;
global.doGet = doGet;
