import { Low, JSONFile } from 'lowdb'

class StorageService {
  constructor() {
    const adapter = new JSONFile('../db.json')
    this.db = new Low(adapter)
  }
}

export default StorageService
