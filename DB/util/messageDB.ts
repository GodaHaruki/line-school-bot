import { type MessageEvent } from '@line/bot-sdk'
import { KVDB } from '../KVDB'

class MessageDB extends KVDB<string, MessageEvent> {
  constructor (id: string) {
    super(`message-${id}`)
  }
}

export default MessageDB;