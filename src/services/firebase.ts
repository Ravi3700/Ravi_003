import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

// Retrieve configuration from Vite client environment variables
const getFirebaseConfig = (): FirebaseClientConfig | null => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (!apiKey || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
};

export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId && config.appId);
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (appInstance) return appInstance;

  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    return appInstance;
  } catch (error) {
    console.warn('[Firebase] Initialization warning:', error);
    return null;
  }
};

export const getFirebaseAuth = (): Auth | null => {
  if (authInstance) return authInstance;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    authInstance = getAuth(app);
    // Explicitly configure browser local persistence for persistent anonymous visitor identity
    if (typeof window !== 'undefined') {
      setPersistence(authInstance, browserLocalPersistence).catch(() => {
        try {
          if (authInstance) setPersistence(authInstance, inMemoryPersistence);
        } catch (e) {}
      });
    }
    return authInstance;
  } catch (error) {
    console.warn('[Firebase Auth] Initialization warning:', error);
    return null;
  }
};

export const getFirebaseDb = (): Firestore | null => {
  if (dbInstance) return dbInstance;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (error) {
    console.warn('[Firestore] Initialization warning:', error);
    return null;
  }
};

/**
 * Ensures anonymous authentication with local device persistence
 */
export const ensureAnonymousAuth = async (): Promise<User | null> => {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  if (auth.currentUser) {
    return auth.currentUser;
  }

  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('[Firebase Auth] Anonymous sign-in error:', error);
    return null;
  }
};

/**
 * Diagnostic connection tester conforming to Firebase skill guidelines
 */
export const testFirestoreConnection = async (): Promise<boolean> => {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    await getDocFromServer(doc(db, 'stats', 'portfolio'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or database unreachable.');
    }
    return false;
  }
};
