import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'

import {
  getFirebaseAuth,
  getFirebaseConfigError,
  getFirebaseDb,
} from '@/frontend/services/firebase'

type AuthMode = 'signIn' | 'createAccount'
type RequestState = 'idle' | 'loading' | 'success' | 'error'

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account already exists for that email. Try signing in instead.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/popup-closed-by-user': 'Google sign-in was closed before it finished.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/user-not-found': 'No account was found for that email.',
  'auth/weak-password': 'Use a stronger password with at least 6 characters.',
  'auth/wrong-password': 'The email or password is incorrect.',
}

const getAuthMessage = (error: unknown) => {
  const code = (error as FirebaseError)?.code

  if (code && authErrorMessages[code]) {
    return authErrorMessages[code]
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

const saveAccount = async (user: User, displayName?: string, isNewAccount = false) => {
  const db = getFirebaseDb()
  const accountRef = doc(db, 'accounts', user.uid)

  await setDoc(
    accountRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      provider: user.providerData[0]?.providerId || 'password',
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(isNewAccount ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true },
  )
}

const LoginPage = () => {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [message, setMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const configError = getFirebaseConfigError()
  const isCreatingAccount = authMode === 'createAccount'

  useEffect(() => {
    if (configError) {
      setRequestState('error')
      setMessage(configError)
      return undefined
    }

    const auth = getFirebaseAuth()

    return onAuthStateChanged(auth, user => {
      setCurrentUser(user)

      if (user) {
        setRequestState('success')
        setMessage('')
      }
    })
  }, [configError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (configError) {
      setRequestState('error')
      setMessage(configError)
      return
    }

    if (!email.trim() || !password.trim()) {
      setRequestState('error')
      setMessage('Please enter both your email and password.')
      return
    }

    if (isCreatingAccount && !displayName.trim()) {
      setRequestState('error')
      setMessage('Please enter your name to create an account.')
      return
    }

    setRequestState('loading')
    setMessage('')

    try {
      const auth = getFirebaseAuth()

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)

      if (isCreatingAccount) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)

        await updateProfile(credential.user, { displayName: displayName.trim() })
        await saveAccount(credential.user, displayName.trim(), true)

        setRequestState('success')
        setMessage('Account created. Redirecting...')

        saveAccount(credential.user, displayName.trim(), true).catch(error => {
          console.error('Failed to save account profile:', error)
        })

        router.push('/')

        return
      }

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password)

      setRequestState('success')
      setMessage('Signed in. Redirecting...')

      saveAccount(credential.user).catch(error => {
        console.error('Failed to save account profile:', error)
      })

      router.push('/')
    } catch (error) {
      setRequestState('error')
      setMessage(getAuthMessage(error))
    }
  }

  const handleGoogleSignIn = async () => {
    if (configError) {
      setRequestState('error')
      setMessage(configError)
      return
    }

    setRequestState('loading')
    setMessage('')

    try {
      const auth = getFirebaseAuth()

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)

      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })

      const credential = await signInWithPopup(auth, provider)

      setRequestState('success')
      setMessage('Signed in with Google. Redirecting...')

      saveAccount(credential.user, credential.user.displayName || '', true).catch(error => {
        console.error('Failed to save account profile:', error)
      })

      router.push('/')
    } catch (error) {
      setRequestState('error')
      setMessage(getAuthMessage(error))
    }
  }

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setRequestState('error')
      setMessage('Enter your email address first, then request a password reset.')
      return
    }

    try {
      const auth = getFirebaseAuth()
      await sendPasswordResetEmail(auth, email.trim())
      setRequestState('success')
      setMessage('Password reset email sent.')
    } catch (error) {
      setRequestState('error')
      setMessage(getAuthMessage(error))
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(getFirebaseAuth())
      setRequestState('success')
      setMessage('You have been signed out.')
    } catch (error) {
      setRequestState('error')
      setMessage(getAuthMessage(error))
    }
  }

  return (
    <div className="min-h-screen bg-mapBg text-dark">
      <Head>
        <title>{isCreatingAccount ? 'Create account' : 'Login'} | Geostory</title>
      </Head>

      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <section className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Geostory</p>
            <h1 className="mt-3 text-4xl font-black">
              {isCreatingAccount ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-base text-darkLight">
              {isCreatingAccount
                ? 'Save your profile with Firebase and start collecting map memories.'
                : 'Sign in with Firebase to continue exploring your map memories.'}
            </p>
          </div>

          {currentUser && (
            <div className="mb-6 rounded-2xl border border-light bg-mapBg p-4 text-sm">
              <p className="font-bold">
                Signed in as {currentUser.displayName || currentUser.email}
              </p>
              <button
                type="button"
                className="mt-2 font-bold text-primary hover:underline"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-light p-1 text-sm font-bold">
            <button
              type="button"
              className={`rounded-xl px-3 py-2 ${
                !isCreatingAccount ? 'bg-white shadow' : 'text-gray'
              }`}
              onClick={() => {
                setAuthMode('signIn')
                setMessage('')
                setRequestState('idle')
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-2 ${
                isCreatingAccount ? 'bg-white shadow' : 'text-gray'
              }`}
              onClick={() => {
                setAuthMode('createAccount')
                setMessage('')
                setRequestState('idle')
              }}
            >
              Create account
            </button>
          </div>

          <button
            type="button"
            disabled={requestState === 'loading'}
            onClick={handleGoogleSignIn}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-light bg-white px-5 py-3 text-base font-black shadow-sm transition hover:bg-mapBg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-xl">G</span>
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-light" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray">or</span>
            <div className="h-px flex-1 bg-light" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isCreatingAccount && (
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={event => setDisplayName(event.target.value)}
                  className="w-full rounded-2xl border border-light px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-light px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input
                type="password"
                autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-light px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-light"
                />
                Remember me
              </label>

              {!isCreatingAccount && (
                <button
                  type="button"
                  className="font-bold text-primary hover:underline"
                  onClick={handlePasswordReset}
                >
                  Forgot password?
                </button>
              )}
            </div>

            {message && (
              <p
                className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                  requestState === 'error' ? 'bg-mapBg text-error' : 'bg-mapBg text-success'
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={requestState === 'loading'}
              className="w-full rounded-2xl bg-primary px-5 py-3 text-lg font-black text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestState === 'loading'
                ? 'Working...'
                : isCreatingAccount
                ? 'Create account'
                : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-darkLight">
            Prefer the map?{' '}
            <Link href="/" className="font-bold text-primary hover:underline">
              Back to Geostory
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
