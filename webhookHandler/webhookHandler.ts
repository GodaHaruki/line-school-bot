import {
  WebhookEvent,
  WebhookRequestBody,
  MessageEvent,
  UnsendEvent,
  FollowEvent,
  UnfollowEvent,
  JoinEvent,
  LeaveEvent,
  MemberJoinEvent,
  MemberLeaveEvent,
  PostbackEvent,
  VideoPlayCompleteEvent,
  BeaconEvent,
  AccountLinkEvent,
  LINEThingsScenarioExecutionEvent,
} from "@line/bot-sdk";

type WebhookEventImplement<Evt extends WebhookEvent> = (
  evt: Evt
) => Promise<void>;

interface WebhookEventImplements {
  message?: WebhookEventImplement<MessageEvent>; // anyにして実装の自由度を上げてもいいかも
  unsend?: WebhookEventImplement<UnsendEvent>;
  follow?: WebhookEventImplement<FollowEvent>;
  unfollow?: WebhookEventImplement<UnfollowEvent>;
  join?: WebhookEventImplement<JoinEvent>;
  leave?: WebhookEventImplement<LeaveEvent>;
  memberJoined?: WebhookEventImplement<MemberJoinEvent>;
  memberLeft?: WebhookEventImplement<MemberLeaveEvent>;
  postback?: WebhookEventImplement<PostbackEvent>;
  videoPlayComplete?: WebhookEventImplement<VideoPlayCompleteEvent>;
  beacon?: WebhookEventImplement<BeaconEvent>;
  accountLink?: WebhookEventImplement<AccountLinkEvent>;
  things?: WebhookEventImplement<LINEThingsScenarioExecutionEvent>;
}

class WebhookHandlers {
  eventsHandler: WebhookEventImplements;

  constructor(eventImplements?: WebhookEventImplements) {
    if (eventImplements) {
      this.eventsHandler = eventImplements;
    } else {
      this.eventsHandler = {};
    }
  }

  handle(evt: WebhookRequestBody): Promise<void> {
    return new Promise((resolve, reject) => {
      evt.events.forEach((e) => {
        const type = e.type;
        const handler = this.eventsHandler[type];
        if (handler) {
          resolve(handler(e as any)); // evt.typeがhandlerのタイプと一致するからanyでごまかす
        } else {
          reject(`${type} handler is not implemented`);
        }
      });
    });
  }

  protected setHandler<Evt extends WebhookEvent>(
    handlerName: keyof WebhookEventImplements,
    f: WebhookEventImplement<Evt>
  ) {
    if (!handlerName) {
      throw TypeError("handlerName is empty");
    }

    this.eventsHandler[handlerName] = f as any; // handlerNameがhandlerのタイプと一致するからanyでごまかす
  }

  // (
  //   [
  //     "message",
  //     "unsend",
  //     "follow",
  //     "unfollow",
  //     "join",
  //     "leave",
  //     "memberJoined",
  //     "memberLeft",
  //     "postback",
  //     "videoPlayComplete",
  //     "beacon",
  //     "accountLink",
  //     "things",
  //   ] as (keyof WebhookEventImplements)[]
  // ).forEach((k) => Object.defineProperty(this, k, this.eventsHandler[k]!));

  set message(f: WebhookEventImplement<MessageEvent>) {
    this.setHandler("message", f);
  }

  set unsend(f: WebhookEventImplement<UnsendEvent>) {
    this.setHandler("unsend", f);
  }

  set follow(f: WebhookEventImplement<FollowEvent>) {
    this.setHandler("follow", f);
  }

  set unfollow(f: WebhookEventImplement<UnfollowEvent>) {
    this.setHandler("unfollow", f);
  }

  set join(f: WebhookEventImplement<JoinEvent>) {
    this.setHandler("join", f);
  }

  set leave(f: WebhookEventImplement<LeaveEvent>) {
    this.setHandler("leave", f);
  }

  set memberJoined(f: WebhookEventImplement<MemberJoinEvent>) {
    this.setHandler("memberJoined", f);
  }

  set memberLeft(f: WebhookEventImplement<MemberLeaveEvent>) {
    this.setHandler("memberLeft", f);
  }

  set postback(f: WebhookEventImplement<PostbackEvent>) {
    this.setHandler("postback", f);
  }

  set videoPlayComplete(f: WebhookEventImplement<VideoPlayCompleteEvent>) {
    this.setHandler("videoPlayComplete", f);
  }

  set beacon(f: WebhookEventImplement<BeaconEvent>) {
    this.setHandler("beacon", f);
  }

  set accountLink(f: WebhookEventImplement<AccountLinkEvent>) {
    this.setHandler("accountLink", f);
  }

  set things(f: WebhookEventImplement<LINEThingsScenarioExecutionEvent>) {
    this.setHandler("things", f);
  }
}

export default WebhookHandlers;
