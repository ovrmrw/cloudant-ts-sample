import 'babel-polyfill'

import { CloudantController, DocumentBase, SearchResult } from './cloudant-controller'

const cc = new CloudantController();

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