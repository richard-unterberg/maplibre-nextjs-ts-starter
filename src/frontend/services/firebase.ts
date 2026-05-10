import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

type FirebaseClientConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
}

export const getFirebaseConfigError = () => {
  const missingVars = [
    !firebaseConfig.apiKey ? 'NEXT_PUBLIC_FIREBASE_API_KEY' : '',
    !firebaseConfig.authDomain ? 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' : '',
    !firebaseConfig.projectId ? 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' : '',
    !firebaseConfig.storageBucket ? 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' : '',
    !firebaseConfig.messagingSenderId ? 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID' : '',
    !firebaseConfig.appId ? 'NEXT_PUBLIC_FIREBASE_APP_ID' : '',
  ].filter(Boolean)

  if (missingVars.length === 0) {
    return null
  }

  return `Missing Firebase environment variables: ${missingVars.join(', ')}`
}

const getFirebaseApp = (): FirebaseApp => {
  const configError = getFirebaseConfigError()

  if (configError) {
    throw new Error(configError)
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp())

export const getFirebaseDb = (): Firestore => getFirestore(getFirebaseApp())
