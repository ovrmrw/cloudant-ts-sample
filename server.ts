import 'babel-polyfill'
import lodash from 'lodash'

require('dotenv').load()

const account: string = process.env.CLOUDANT_USERNAME || ''
const key: string = process.env.CLOUDANT_API_KEY || ''
const password: string = process.env.CLOUDANT_API_PASSWORD || ''


class CloudantController {
  cloudant: any;

  constructor(account: string, key: string, password: string) {
    const Cloudant = require('cloudant')
    this.cloudant = Cloudant({ account, key, password })
  }

  // NEEDS _admin permission
  createDatabase(dbName: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      this.cloudant.db.create(dbName, (err, body, header) => {
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

  // NEEDS _admin permission
  dropDatabase(dbName: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      this.cloudant.db.destroy(dbName, (err, body, header) => {
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

  private use(dbName: string): any {
    return this.cloudant.db.use(dbName)
  }

  insertDocument<T>(dbName: string, insertObj: T, _id?: string): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      const db = this.use(dbName)
      const temp = lodash.defaultsDeep<T, T>(insertObj, _id ? { _id: _id } : {})
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

  getDocument<T>(dbName: string, _id: string): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      const db = this.use(dbName)
      db.get(_id, (err, data, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Get Document')
        console.log(data)
        resolve(data)
      })
    })
  }

  deleteDocument(dbName: string, deleteObj: DocumentBase): Promise<{} | null> {
    return new Promise<{} | null>((resolve, reject) => {
      const db = this.use(dbName)
      db.destroy(deleteObj._id, deleteObj._rev, (err, body, header) => {
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

  searchDocument<T>(dbName: string, designName: string, indexName: string, searchText: string): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      const db = this.use(dbName)
      db.search(designName, indexName, { q: searchText }, (err, result, header) => {
        if (err) {
          console.error(err)
          reject(null)
          return
        }
        console.log('Search Document')
        console.log(result)
        resolve(result)
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

// const DB = 'alice' // Database Name which you created.
const cc = new CloudantController(account, key, password);

/*
(async () => {
  // await cc.dropDatabase(ALICE) // NEEDS _admin permission
  // await cc.createDatabase(ALICE) // NEEDS _admin permission
  const KEY = 'rabbit'
  await cc.insertDocument<Alice>(DB, { crazy: true, a: 1, b: '2' }, KEY)
  let document = await cc.getDocument<Alice & DocumentBase>(DB, KEY)
  if (document) {
    document.b = 'edited'
    await cc.insertDocument<Alice & DocumentBase>(DB, document)
    document = await cc.getDocument<Alice & DocumentBase>(DB, KEY)
  }
  if (document) {
    await cc.deleteDocument(DB, document)
    await cc.getDocument<Alice & DocumentBase>(DB, KEY) // MUST BE ERROR
  }
})()
*/

interface DocumentBase {
  _id?: string
  _rev?: string
}

interface Alice {
  crazy: boolean
  a: number
  b: string
}

//////////////////////////////////////////////////////////////////////////////

const DB = 'mydb' // Database Name which you created.

  ;
(async () => {
  console.time('time')
  const result = await cc.searchDocument<SearchResult<MyDoc>>(DB, 'mydbdoc', 'mydbsearch', 'テキスト')
  if (result) {
    result.rows.forEach(row => console.log(row.fields))
  }
  console.timeEnd('time')
})()


interface MyDoc {
  name: string
  desc: string
}

interface SearchResult<T> {
  total_rows: number
  bookmark: string
  rows: SearchResultRow<T>[]
}

interface SearchResultRow<T> {
  id: string
  order: number[]
  fields: T
}