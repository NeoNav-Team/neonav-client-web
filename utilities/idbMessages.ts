import { NnChatMessage } from '@/components/context/nnTypes';

const DB_NAME = 'neonav-chat';
const STORE_NAME = 'messages';
export const MSG_CAP = 30;
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_channel_ts', ['channel', 'ts']);
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
  return dbPromise;
}

export async function idbGetMessages(channelId: string): Promise<NnChatMessage[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.objectStore(STORE_NAME).index('by_channel_ts');
    const range = IDBKeyRange.bound([channelId, ''], [channelId, '\uffff']);
    const req = index.getAll(range);
    req.onsuccess = () => {
      const msgs = req.result as NnChatMessage[];
      msgs.sort((a, b) => ((b.ts ?? '') > (a.ts ?? '') ? 1 : -1));
      resolve(msgs.slice(0, MSG_CAP));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetLatestTs(channelId: string): Promise<string | null> {
  const msgs = await idbGetMessages(channelId);
  return msgs.length ? (msgs[0].ts ?? null) : null;
}

export async function idbGetLatestId(channelId: string): Promise<string | null> {
  const msgs = await idbGetMessages(channelId);
  return msgs.length ? (msgs[0].id ?? null) : null;
}

export async function idbPutMessages(messages: NnChatMessage[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    messages.forEach(msg => { if (msg.id) store.put(msg); });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbGetChannels(): Promise<string[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.objectStore(STORE_NAME).index('by_channel_ts');
    const channels = new Set<string>();
    const req = index.openKeyCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        channels.add((cursor.key as [string, string])[0]);
        cursor.continue();
      } else {
        resolve([...channels]);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function idbClearChannel(channelId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('by_channel_ts');
    const range = IDBKeyRange.bound([channelId, ''], [channelId, '\uffff']);
    const req = index.getAll(range);
    req.onsuccess = () => {
      const all = req.result as NnChatMessage[];
      all.forEach(msg => { if (msg.id) store.delete(msg.id); });
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbCullChannel(channelId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('by_channel_ts');
    const range = IDBKeyRange.bound([channelId, ''], [channelId, '\uffff']);
    const req = index.getAll(range);
    req.onsuccess = () => {
      const all = req.result as NnChatMessage[];
      all.sort((a, b) => ((b.ts ?? '') > (a.ts ?? '') ? 1 : -1));
      all.slice(MSG_CAP).forEach(msg => { if (msg.id) store.delete(msg.id); });
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
