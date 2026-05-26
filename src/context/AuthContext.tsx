import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  User,
} from 'firebase/auth';
import { auth, gProvider } from '../firebase';

interface AuthCtx {
  user:    User | null | undefined; // undefined = loading
  loading: boolean;
  signIn:  () => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const IS_PROD = window.location.hostname !== 'localhost';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
    return onAuthStateChanged(auth, setUser);
  }, []);

  function signIn() {
    if (IS_PROD) return signInWithRedirect(auth, gProvider);
    return signInWithPopup(auth, gProvider);
  }

  return (
    <Ctx.Provider value={{
      user,
      loading: user === undefined,
      signIn,
      signOut: () => fbSignOut(auth),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
