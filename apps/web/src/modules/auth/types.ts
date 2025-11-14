export type AuthStep = 'sign-in' | 'xp-intro' | 'profile' | 'complete';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface XpIntroContent {
  headline: string;
  description: string;
  actions: Array<{
    id: string;
    label: string;
    amount: number;
  }>;
}

export interface ProfileDraft {
  displayName: string;
  title: string;
  favoriteGame: string;
  region: string;
  goals: string;
}

export interface AuthState {
  step: AuthStep;
  email?: string;
  xpTotal: number;
  profile: ProfileDraft;
}

export interface AuthFlowCallbacks {
  onSignIn(payload: SignInPayload): Promise<{ xpTotal: number }>;
  onComplete(profile: ProfileDraft): Promise<void> | void;
}
