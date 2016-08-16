import 'babel-polyfill'
import lodash from 'lodash'

require('dotenv').load()

const username: string = process.env.CLOUDANT_USERNAME || ''
const password: string = process.env.CLOUDANT_PASSWORD || ''


class CloudantController {
  cloudant: any;

  constructor(account: string, password: string) {
    const Cloudant = require('cloudant')
    this.cloudant = Cloudant({ account: username, password: password })
  }

  createDatabase(dbname: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      this.cloudant.db.create(dbname, (err, body, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Create Database')
        console.log(body)
        resolve(body)
      })
    })
  }

  dropDatabase(dbname: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      this.cloudant.db.destroy(dbname, (err, body, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Destroy Database')
        console.log(body)
        resolve(body)
      })
    })
  }

  private use(dbname: string): any {
    return this.cloudant.db.use(dbname)
  }

  insertDocument<T>(dbname: string, obj: T, key?: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      const db = this.use(dbname)
      const temp = lodash.defaultsDeep<T, T>(obj, key ? { _id: key } : {})
      db.insert(temp, (err, body, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Insert Document')
        console.log(body)
        resolve(body)
      })
    })
  }

  getDocument<T>(dbname: string, key: string): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      const db = this.use(dbname)
      db.get(key, (err, data, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Select Document')
        console.log(data)
        resolve(data)
      })
    })
  }

  deleteDocument(dbname: string, obj: DbBase): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      const db = this.use(dbname)
      db.destroy(obj._id, obj._rev, (err, body, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Delete Document')
        console.log(body)
        resolve(body)
      })
    })
  }

}


// cloudant.db.destroy('alice', (err) => {
//   if (err) { console.error(err) }

//   cloudant.db.create('alice', () => {

//     const alice = cloudant.db.use('alice')
//     alice.insert({ crazy: true }, 'rabbit', (err, body, header) => {
//       if (err) { console.error(err) }

//       console.log('You have inserted the rabbit!')
//       console.log(body)
//     })
//   })
// })

//////////////////////////////////////////////////////////////////////////////

const ALICE = 'alice'
const cc = new CloudantController(username, password);


(async () => {
  await cc.dropDatabase(ALICE)
  await cc.createDatabase(ALICE)
  await cc.insertDocument<Alice>(ALICE, { crazy: true, a: 1, b: '2' }, 'rabbit')
  let doc = await cc.getDocument<Alice>(ALICE, 'rabbit')
  if (doc) {
    doc.b = 'edited'
    await cc.insertDocument<Alice>(ALICE, doc)
    doc = await cc.getDocument<Alice>(ALICE, 'rabbit')
  }
  if (doc) {
    await cc.deleteDocument(ALICE, doc)
    await cc.getDocument<Alice>(ALICE, 'rabbit') // ERROR
  }
})()


interface DbBase {
  _id?: string
  _rev?: string
}

interface Alice extends DbBase {
  crazy: boolean
  a: number
  b: string
}