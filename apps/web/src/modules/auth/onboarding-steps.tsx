import React, { FormEvent, useMemo } from 'react';

import { useAuthContext } from './context';

const regions = ['North America', 'Europe', 'Asia', 'South America', 'Oceania'];
const games = ['League of Legends', 'Valorant', 'CS2', 'Rocket League', 'Overwatch 2'];

export function OnboardingSteps(): JSX.Element {
  const { profile, updateProfile, advance, callbacks } = useAuthContext();

  const isValid = useMemo(
    () =>
      Boolean(
        profile.displayName &&
          profile.title &&
          profile.favoriteGame &&
          profile.region &&
          profile.goals,
      ),
    [profile],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    callbacks
      .onComplete(profile)
      .then(() => advance('complete'))
      .catch((error) => {
        console.error('Unable to complete onboarding', error);
        alert('Something went wrong while saving your profile. Try again.');
      });
  }

  return (
    <form className="onboarding" onSubmit={handleSubmit}>
      <div className="grid">
        <label>
          Display name
          <input
            required
            type="text"
            value={profile.displayName}
            onChange={(event) => updateProfile({ displayName: event.target.value })}
          />
        </label>

        <label>
          Role / Title
          <input
            required
            type="text"
            value={profile.title}
            onChange={(event) => updateProfile({ title: event.target.value })}
          />
        </label>
      </div>

      <div className="grid">
        <label>
          Region
          <select
            required
            value={profile.region}
            onChange={(event) => updateProfile({ region: event.target.value })}
          >
            <option value="">Choose a region</option>
            {regions.map((region) => (
              <option value={region} key={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label>
          Primary game
          <select
            required
            value={profile.favoriteGame}
            onChange={(event) => updateProfile({ favoriteGame: event.target.value })}
          >
            <option value="">Choose a title</option>
            {games.map((game) => (
              <option value={game} key={game}>
                {game}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        What do you want to achieve next?
        <textarea
          rows={4}
          required
          value={profile.goals}
          onChange={(event) => updateProfile({ goals: event.target.value })}
        />
      </label>

      <footer>
        <button type="submit" disabled={!isValid}>
          Save profile and finish
        </button>
      </footer>
    </form>
  );
}

export const onboardingStyles = `
.onboarding {
  display: grid;
  gap: 20px;
}

.onboarding .grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.onboarding label {
  display: grid;
  gap: 8px;
  font-weight: 600;
}

.onboarding input,
.onboarding select,
.onboarding textarea {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.5);
  color: inherit;
}

.onboarding footer {
  display: flex;
  justify-content: flex-end;
}

.onboarding button {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: linear-gradient(135deg, #14b8a6, #22d3ee);
  color: #0f172a;
  font-weight: 700;
}
`;
