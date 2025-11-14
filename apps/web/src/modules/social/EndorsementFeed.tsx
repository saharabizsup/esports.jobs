import React from 'react';
import { Endorsement } from './types';

interface EndorsementFeedProps {
  endorsements: Endorsement[];
}

const endorsementCopy: Record<Endorsement['category'], string> = {
  teamwork: 'Teamwork',
  shotcaller: 'Shot Caller',
  leader: 'Leadership',
  strategist: 'Strategist',
};

const EndorsementFeed: React.FC<EndorsementFeedProps> = ({ endorsements }) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Endorsements</h2>
        <p className="text-sm text-slate-500">
          Recognize teammates for exceptional play. Endorsements boost visibility in team searches.
        </p>
      </header>
      <ul className="space-y-4">
        {endorsements.map((endorsement) => (
          <li key={endorsement.id} className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {endorsement.from} ➜ {endorsement.to}
              </span>
              <time>{new Date(endorsement.createdAt).toLocaleString()}</time>
            </div>
            <p className="mt-2 text-sm font-semibold text-indigo-600">
              {endorsementCopy[endorsement.category]}
            </p>
            {endorsement.message ? (
              <p className="mt-1 text-sm text-slate-600">{endorsement.message}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EndorsementFeed;
