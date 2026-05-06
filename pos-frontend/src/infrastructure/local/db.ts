import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface POSDBSchema extends DBSchema {
  orders: {
    key: string
    value: {
      id: string
      data: string // JSON serialized order
      status: string
      updatedAt: number
    }
    indexes: { 'by-status': string }
  }
  products: {
    key: string
    value: {
      id: string
      data: string // JSON serialized product
      cachedAt: number
    }
  }
  syncQueue: {
    key: number
    value: {
      id?: number
      type: 'order'
      entityId: string
      action: 'save' | 'complete' | 'delete'
      payload: string
      createdAt: number
    }
    indexes: { 'by-type': string }
  }
}

const DB_NAME = 'pos-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<POSDBSchema> | null = null

export async function getDB(): Promise<IDBPDatabase<POSDBSchema>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<POSDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Orders store
      const orderStore = db.createObjectStore('orders', { keyPath: 'id' })
      orderStore.createIndex('by-status', 'status')

      // Products cache store
      db.createObjectStore('products', { keyPath: 'id' })

      // Sync queue store
      const syncStore = db.createObjectStore('syncQueue', {
        keyPath: 'id',
        autoIncrement: true,
      })
      syncStore.createIndex('by-type', 'type')
    },
  })

  return dbInstance
}
