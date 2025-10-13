import { signOut as firebaseSignOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types/auth";

interface AuthContextProps {
  authState: AuthState;
  signWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const onsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        console.error("authentication error");
        setAuthState({
          user: null,
          error: error.message,
          loading: false,
        });
      },
    );

    return () => onsubscribe(); // limpa e para de de ouvir as mudanças de autenticação
  }, []);

  const signWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error to try sign in with google";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error to try sign out";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
