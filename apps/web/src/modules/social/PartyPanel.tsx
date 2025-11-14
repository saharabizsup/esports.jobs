import React from 'react';
import { PartyMember } from './types';

interface PartyPanelProps {
  members: PartyMember[];
  partyName: string;
  invitesOpen?: boolean;
}

const statusCopy: Record<PartyMember['status'], string> = {
  online: 'Online',
  inMatch: 'In Match',
  offline: 'Offline',
};

const statusColor: Record<PartyMember['status'], string> = {
  online: 'text-emerald-500',
  inMatch: 'text-amber-500',
  offline: 'text-slate-400',
};

const PartyPanel: React.FC<PartyPanelProps> = ({ members, partyName, invitesOpen }) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{partyName}</h2>
          <p className="text-xs text-slate-500">Coordinate ready checks, map bans, and loadouts.</p>
        </div>
        {invitesOpen ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
            Invites Open
          </span>
        ) : null}
      </header>
      <ul className="mt-4 space-y-3">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">{member.handle}</p>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
            <span className={`text-xs font-semibold ${statusColor[member.status]}`}>
              {statusCopy[member.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PartyPanel;
