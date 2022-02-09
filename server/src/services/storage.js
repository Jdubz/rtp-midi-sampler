const { AsyncNedb } = require('nedb-async')
const path = require('path')

// ToDo migrate to nedb-promises https://www.npmjs.com/package/nedb-promises
class StorageService {
  constructor() {
    const filename = path.resolve('./data.db')
    this.db = new AsyncNedb({
      filename,
      autoload: true,
    });
  }

  index = async () => {
    await this.db.asyncEnsureIndex({ fieldName: 'type' })
  }

  insert = async (type, data) => {
    const doc = {
      ...data,
      type,
    }
    return await this.db.asyncInsert(doc)
  }

  find = async (type, data) => {
    const query = {
      ...data,
      type,
    }
    return await this.db.asyncFind(query)
  }

  findOne = async (type, data) => {
    const query = {
      ...data,
      type,
    }
    return await this.db.asyncFindOne(query)
  }

  update = async (type, query, data) => {
    const doc = {
      ...data,
      type,
    }
    return await this.db.asyncUpdate(query, doc)
  }
}

module.exports = StorageService
