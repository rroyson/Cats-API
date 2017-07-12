const PouchDB = require('pouchdb-http')

const db = new PouchDB(
  'https://civamitzentsofuedoonahic:cd7b633f29685c0d2145a7b2f3602857c8b41329@ad242826-b19a-46a8-8704-0c1f69fe15e0-bluemix.cloudant.com/test'
)
console.log('process.env.COUCHDB_NAME:', process.env.COUCHDB_NAME)
console.log('process.env.COUCHDB_SERVER:', process.env.COUCHDB_SERVER)
// console.log('database', db)

var catsData = [
  {
    id: 2,
    type: 'cat',
    breed: 'Siamese',
    desc:
      'The Siamese cat is one of the first distinctly recognized breeds of Asian cat. Derived from the rtgs: wichianmat landrace, one of several varieties of cat native to Thailand.'
  },
  {
    id: 3,
    type: 'cat',
    breed: 'Maine Coon',
    desc:
      'The Maine Coon is the largest domesticated breed of cat. It has a distinctive physical appearance and valuable hunting skills.'
  },
  {
    id: 4,
    type: 'cat',
    breed: 'Pixie-bob',
    desc:
      'The Pixie-bob is a breed of domestic cat claimed by breed founder Carol Ann Brewer of Washington State to be the progeny of naturally occurring bobcat hybrids.'
  }
]

const { append, find, map, reject, compose } = require('ramda')

// function listCats(callback) {
//   db.allDocs(
//     {
//       include_docs: true,
//       attachments: true,
//       startkey: 'cat_',
//       endkey: 'cat_\uffff'
//     },
//     function(err, cats) {
//       if (err) callback(err)
//
//       callback(null, map(row => row.doc, cats.rows))
//     }
//   )
// }

function listBreeds(limit, callback) {
  const options = limit
    ? {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff',
        limit
      }
    : {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff'
      }

  list(options, callback)
}

function listCats(limit, callback) {
  const options = limit
    ? {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff',
        limit
      }
    : {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff'
      }

  list(options, callback)
}

function list(options, callback) {
  db.allDocs(options, function(err, cats) {
    if (err) callback(err)
    callback(null, map(row => row.doc, cats.rows))
  })
}

function getCat(catId, callback) {
  // const foundCat = find(cat => cat.id === catId, catsData)
  // callback(null, foundCat)
  db.get(catId, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function updateCat(cat, callback) {
  // catsData = compose(append(cat), reject(c => c.id === id))(catsData)
  db.put(cat, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteCat(catId, callback) {
  db
    .get(catId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callbakc(err)
    })
}

function addCat(cat, callback) {
  catsData = append(cat, catsData)
  callback(null, cat)
}

const dal = {
  addCat,
  listCats,
  getCat,
  updateCat,
  deleteCat,
  listBreeds
}

module.exports = dal
