import { Db, MongoClient } from 'mongodb'

import envVariables from '@/schemas/env-variables.schema'

const URI = `mongodb+srv://${envVariables.DB_USERNAME}:${envVariables.DB_PASSWORD}@devoverflowsingapore.lhj6o.mongodb.net/?retryWrites=true&w=majority&appName=${envVariables.DB_CLUSTER}`

class DatabaseService {
  private db: Db
  client: MongoClient

  constructor() {
    this.client = new MongoClient(URI)
    this.db = this.client.db(envVariables.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('🎉 Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('🚨 Unable to connect to the database:', error)
      throw error
    }
  }
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService
