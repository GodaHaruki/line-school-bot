class KVDB<K, V> { // Key Value db
  protected sheet: GoogleAppsScript.Spreadsheet.Sheet

  constructor (name: string) {
    const sheet = SpreadsheetApp.getActive().getSheetByName(name)
    if (!sheet) { throw Error(`there is no sheet named ${name}`) }
    this.sheet = sheet
  }

  protected async findImpl (key: K): Promise<{ key: K, value: V, row: number }> {
    return await new Promise((resolve, reject) => {
      const lastRow = this.sheet.getLastRow()
      const values: Array<[K, V]> = this.sheet.getRange(1, 1, lastRow, 2).getValues() as Array<[K, V]>
      values.forEach((line: [K, V], i: number) => {
        const lineKey = line[0]
        const value = line[1]
        const row = i + 1
        if (key == lineKey) {
          resolve({ key, value, row })
        }
      })// .then(_ => reject(`key: ${key} was not found on DB`))
      // もしPromiseの関係で下のrejectがresolveよりも先に実行されていたら、上のコメントみたいな方法でやれば大丈夫かも
      // Promiseは一回settledされるとresolveももrejectも効果無くなるらしいから先にresolveされるから問題ないはず
      reject(`key: ${key} was not found on DB`)
    })
  }

  protected getLineRange (row: number) {
    return this.sheet.getRange(row, 1, 1, 2)
  }

  protected getSetFunc (row: number) {
    const range = this.getLineRange(row)

    const setValue = (key: K, value: V) => {
      range.setValues([[key, value]])
    }
    return { setValue }
  }

  async find (f: (k: K, v: V) => boolean): Promise<Array<[K, V]>> {
    return await new Promise((resolve, reject) => {
      this.getAllKV()
        .then(kvs => kvs.filter((kv) => {
          const [k, v] = kv
          if (f(k, v)) { return true }
        }))
        .then(res => { resolve(res) })
    })
  }

  async findByKey (f: (k: K) => boolean): Promise<V[]> {
    return await new Promise((resolve, reject) => {
      this.find((k, _) => f(k))
        .then(kvs => { resolve(kvs.map(kv => kv[1])) })
    })
  }

  async findByValue (f: (v: V) => boolean): Promise<V[]> {
    return await new Promise((resolve, reject) => {
      this.find((_, v) => f(v))
        .then(kvs => { resolve(kvs.map(kv => kv[1])) })
    })
  }

  async push (key: K, value: V): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.findImpl(key)
        .then(_ => { reject('this key is already used. use put instead') })
        .catch(_ => {
          const insertRow = this.sheet.getLastRow() + 1
          this.getSetFunc(insertRow).setValue(key, value)
          resolve()
        })
    })
  }

  async put (key: K, value: V): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.findImpl(key)
        .then(({ row }) => {
          const insertRow = row
          this.getSetFunc(insertRow).setValue(key, value)
          resolve()
        })
        .catch(_ => {
          const insertRow = this.sheet.getLastRow() + 1
          this.getSetFunc(insertRow).setValue(key, value)
          resolve()
        })
    })
  }

  async get (key: K): Promise<V> {
    const { value } = await this.findImpl(key)

    return value
  }

  async gets (keys: K[]): Promise<V[]> {
    const resPromise = keys.map(async (k) => {
      const { value } = await this.findImpl(k)

      return value
    })

    return await Promise.all(resPromise)
  }

  async getAll (): Promise<V[]> {
    return await new Promise((resolve, reject) => {
      const lastRow = this.sheet.getLastRow()

      const values: Array<[K, V]> = this.sheet.getRange(1, 1, lastRow, 2).getValues() as Array<[K, V]>

      const res = values.map(v => v[1])

      resolve(res)
    })
  }

  async getAllKV (): Promise<Array<[K, V]>> {
    return await new Promise((resolve, reject) => {
      const lastRow = this.sheet.getLastRow()

      const values: Array<[K, V]> = this.sheet.getRange(1, 1, lastRow, 2).getValues() as Array<[K, V]>

      resolve(values)
    })
  }

  async delete (key: K): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.findImpl(key)
        .then(({ row }) => { this.getLineRange(row).deleteCells(SpreadsheetApp.Dimension.ROWS) })
        .then(_ => { resolve() })
        .catch(_ => { resolve() })
    })
  }
}
