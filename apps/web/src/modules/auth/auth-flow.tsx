import React, { FormEvent, useMemo, useState } from 'react';

import { AuthProvider, useAuthContext } from './context';
import { OnboardingSteps, onboardingStyles } from './onboarding-steps';
import { XpIntro, xpIntroStyles } from './xp-intro';
import { AuthFlowCallbacks, SignInPayload } from './types';

interface AuthFlowViewProps {
  loading: boolean;
  error?: string;
  onSignIn(values: SignInPayload): void;
}

function AuthFlowView({ loading, error, onSignIn }: AuthFlowViewProps): JSX.Element {
  const { step } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInDisabled = useMemo(() => loading || !email || !password, [loading, email, password]);

  const styles = useMemo(() => `${xpIntroStyles}\n${onboardingStyles}`, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signInDisabled) return;

    onSignIn({ email, password });
  }

  if (step === 'complete') {
    return (
      <section className="auth-complete">
        <style>{styles}</style>
        <h2>Welcome to the esports jobs network</h2>
        <p>
          Your profile is live and recruiters can now find you. Start exploring tailored job openings, mentorship sessions, and
          upcoming scrims to convert your XP into real-world opportunities.
        </p>
      </section>
    );
  }

  return (
    <div className="auth-flow">
      <style>{styles}</style>
      {step === 'sign-in' && (
        <form className="auth-card" onSubmit={handleSubmit}>
          <header>
            <h2>Log in or create your account</h2>
            <p>Use your primary esports email—this helps recruiters verify your achievements.</p>
          </header>

          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <footer>
            <button type="submit" disabled={signInDisabled}>
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </footer>
        </form>
      )}

      {step === 'xp-intro' && <XpIntro />}
      {step === 'profile' && <OnboardingSteps />}

      {step === 'sign-in' && (
        <aside className="auth-card secondary">
          <h3>Why XP matters</h3>
          <ul>
            <li>Unlock community drops</li>
            <li>Queue for verified scrims</li>
            <li>Highlight your growth to hiring managers</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

function AuthFlowContainer({ callbacks }: { callbacks: AuthFlowCallbacks }): JSX.Element {
  const { advance, setXpTotal } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleSignIn(values: SignInPayload) {
    setLoading(true);
    setError(undefined);

    callbacks
      .onSignIn(values)
      .then((result) => {
        setLoading(false);
        setXpTotal(result.xpTotal);
        advance('xp-intro');
      })
      .catch((err) => {
        console.error('Sign in failed', err);
        setLoading(false);
        setError('Unable to sign in. Check your email and password.');
      });
  }

  return <AuthFlowView loading={loading} error={error} onSignIn={handleSignIn} />;
}

interface AuthFlowProps {
  callbacks: AuthFlowCallbacks;
}

export function AuthFlow({ callbacks }: AuthFlowProps): JSX.Element {
  return (
    <AuthProvider callbacks={callbacks}>
      <AuthFlowContainer callbacks={callbacks} />
    </AuthProvider>
  );
}

export const authFlowStyles = `
.auth-flow {
  display: grid;
  gap: 24px;
}

.auth-card {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 24px;
  padding: 28px;
  display: grid;
  gap: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(12px);
}

.auth-card.secondary {
  align-self: flex-start;
}

.auth-card label {
  display: grid;
  gap: 8px;
  text-align: left;
}

.auth-card input {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.35);
  color: inherit;
}

.auth-card footer {
  display: flex;
  justify-content: flex-end;
}

.auth-card button {
  border: none;
  padding: 12px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0f172a;
  font-weight: 700;
}

.auth-complete {
  text-align: center;
  padding: 32px;
  background: rgba(15, 23, 42, 0.75);
  border-radius: 24px;
}
`;
