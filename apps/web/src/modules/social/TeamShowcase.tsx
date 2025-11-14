import React from 'react';
import { TeamSummary } from './types';

interface TeamShowcaseProps {
  teams: TeamSummary[];
}

const TeamShowcase: React.FC<TeamShowcaseProps> = ({ teams }) => {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Competitive Teams</h2>
        <p className="text-sm text-slate-500">
          Share scouting reports and scrimmage results to attract new teammates.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => (
          <article key={team.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{team.name}</h3>
                <p className="text-xs uppercase tracking-wide text-indigo-500">{team.rank}</p>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {team.members.length} members
              </span>
            </header>
            <ul className="space-y-2">
              {team.members.map((member) => (
                <li key={member.id} className="flex items-center justify-between text-sm text-slate-600">
                  <span className="font-medium text-slate-700">{member.handle}</span>
                  <span>{member.role}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TeamShowcase;
