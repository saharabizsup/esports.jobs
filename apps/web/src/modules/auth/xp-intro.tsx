import React from 'react';

import { useAuthContext } from './context';
import { XpIntroContent } from './types';

const defaultIntro: XpIntroContent = {
  headline: 'Level up your esports career',
  description:
    'Earn XP by completing onboarding tasks, joining communities, and showcasing your contributions. Each action unlocks new opportunities.',
  actions: [
    { id: 'complete-profile', label: 'Complete your profile', amount: 50 },
    { id: 'apply-role', label: 'Apply to a role', amount: 35 },
    { id: 'refer-friend', label: 'Refer a teammate', amount: 25 },
  ],
};

interface XpIntroProps {
  content?: XpIntroContent;
}

export function XpIntro({ content = defaultIntro }: XpIntroProps): JSX.Element {
  const { xpTotal, advance } = useAuthContext();

  return (
    <section aria-labelledby="xp-intro-title" className="xp-intro">
      <header>
        <h2 id="xp-intro-title">{content.headline}</h2>
        <p>{content.description}</p>
      </header>

      <ul>
        {content.actions.map((action) => (
          <li key={action.id}>
            <strong>{action.label}</strong>
            <span>{action.amount} XP</span>
          </li>
        ))}
      </ul>

      <footer>
        <p>You have {xpTotal} XP ready to spend on mentorship, scrims, and exclusive drops.</p>
        <button type="button" onClick={() => advance('profile')}>
          Continue to profile setup
        </button>
      </footer>
    </section>
  );
}

export const xpIntroStyles = `
.xp-intro {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 20px;
  padding: 32px;
  display: grid;
  gap: 24px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(12px);
}

.xp-intro header h2 {
  margin: 0 0 8px;
}

.xp-intro ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.xp-intro li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.65);
}

.xp-intro footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.xp-intro button {
  align-self: flex-start;
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, #38bdf8, #3b82f6);
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
}
`;
