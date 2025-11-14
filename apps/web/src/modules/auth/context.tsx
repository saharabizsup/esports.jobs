import React, { createContext, useContext, useMemo, useState } from 'react';

import { AuthFlowCallbacks, AuthState, ProfileDraft } from './types';

interface AuthContextValue extends AuthState {
  updateProfile(partial: Partial<ProfileDraft>): void;
  setXpTotal(total: number): void;
  advance(step: AuthState['step']): void;
  callbacks: AuthFlowCallbacks;
}

const defaultProfile: ProfileDraft = {
  displayName: '',
  title: '',
  favoriteGame: '',
  region: '',
  goals: '',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return value;
}

interface AuthProviderProps {
  children: React.ReactNode;
  callbacks: AuthFlowCallbacks;
}

export function AuthProvider({ children, callbacks }: AuthProviderProps): JSX.Element {
  const [state, setState] = useState<AuthState>({
    step: 'sign-in',
    xpTotal: 0,
    profile: { ...defaultProfile },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      updateProfile(partial) {
        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, ...partial },
        }));
      },
      setXpTotal(total) {
        setState((prev) => ({ ...prev, xpTotal: total }));
      },
      advance(step) {
        setState((prev) => ({ ...prev, step }));
      },
      callbacks,
    }),
    [state, callbacks],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
