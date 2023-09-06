import KVDB from "./KVDB";

interface ReplyTokenInfo {
  replyToken: string;
  timestamp: number;
}

type Timestamp = string;

class UnUsedReplyTokenDB {
  protected db: KVDB<Timestamp, ReplyTokenInfo>;
  public expireTimeMilliseconds: number; // milliseconds. default is 40000 but replyToken is available for 6000 millisec

  constructor(
    id: string,
    expireTimeMilliseconds: number = 40000,
    spreadsheetId?: string
  ) {
    this.db = new KVDB<Timestamp, ReplyTokenInfo>(
      `replyToken-${id}`,
      spreadsheetId
    );
    this.expireTimeMilliseconds = expireTimeMilliseconds;
  }

  async findOne(
    f: (tokenInfo: ReplyTokenInfo, expireTimeMillisecond: number) => boolean
  ): Promise<ReplyTokenInfo> {
    return await new Promise((resolve, reject) => {
      const deletePromise: Array<Promise<void>> = [];

      this.db.getAllKV().then((kvs) => {
        kvs.some((kv) => {
          const k = kv[0];
          const v = kv[1];

          deletePromise.push(this.db.delete(k));

          if (f(v, this.expireTimeMilliseconds)) {
            Promise.all(deletePromise) // not good for performance
              .then((_) => {
                resolve(v);
              });

            return true;
          }
        });
      });
    });
  }

  async findByTime(nowTimeMilliseconds: number): Promise<ReplyTokenInfo> {
    return await new Promise((resolve, reject) => {
      // this.db
      // .find((k, _) => Number(k) + this.expireTimeMilliseconds >= nowTimeMilliseconds)
      // .then(kvs => this.db.delete(kvs[0][0])
      //   .then(_ => resolve(kvs[0][1]))
      // )

      this.findOne((v, t) => v.timestamp + t >= nowTimeMilliseconds).then(
        (v) => {
          resolve(v);
        }
      );
      // resolve(this.findOne((v, t) => v.timestamp + t >= nowTimeMilliseconds))
    });
  }

  async push(value: ReplyTokenInfo): Promise<void> {
    await this.db.push(value.timestamp.toString(), value);
  }

  async deleteExpiredToken(nowTimeMilliseconds: number): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const deletePromise: Array<Promise<void>> = [];

      this.db
        .getAllKV()
        .then((kvs) => {
          kvs.some((kv) => {
            const k = Number(kv[0]); //  k = Timestamp = string

            if (k + this.expireTimeMilliseconds >= nowTimeMilliseconds) {
              Promise.all(deletePromise).then((_) => {
                resolve();
              });
              return true;
            } else {
              deletePromise.push(this.db.delete(kv[0]));
            }
          });
        })
        .then(async (_) => await Promise.all(deletePromise))
        .then((_) => {
          resolve();
        });
    });
  }
}

export default UnUsedReplyTokenDB;
