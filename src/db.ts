/**
 * IndexedDB storage for uploaded audio files.
 *
 * Why IndexedDB instead of localStorage?
 * - localStorage has a ~5 MB limit — too small for audio files
 * - IndexedDB can store hundreds of MB of binary data
 * - Data persists across page refreshes and browser restarts
 * - Perfect for storing MP3/M4A blobs client-side
 */

const DB_NAME = 'musicalHousieDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'songId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Save an audio file to IndexedDB. Returns a fresh blob URL for playback. */
export async function saveAudioFile(songId: number, file: File): Promise<string> {
  const db = await openDB();
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ songId, blob, fileName: file.name, mimeType: file.type });
    tx.oncomplete = () => resolve(URL.createObjectURL(blob));
    tx.onerror = () => reject(tx.error);
  });
}

/** Retrieve a single audio blob URL from IndexedDB. Returns null if not found. */
export async function getAudioUrl(songId: number): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(songId);
    req.onsuccess = () => {
      if (req.result?.blob) {
        resolve(URL.createObjectURL(req.result.blob));
      } else {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

/** Load all stored audio files and return a Map of songId → blobURL. */
export async function getAllAudioUrls(): Promise<Map<number, string>> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const map = new Map<number, string>();
      for (const entry of req.result || []) {
        if (entry.blob) {
          map.set(entry.songId, URL.createObjectURL(entry.blob));
        }
      }
      resolve(map);
    };
    req.onerror = () => resolve(new Map());
  });
}

/** Delete an audio file from IndexedDB. */
export async function deleteAudioFile(songId: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(songId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}
