import React from 'react';
import PartyPanel from './PartyPanel';
import TeamShowcase from './TeamShowcase';
import EndorsementFeed from './EndorsementFeed';
import { Endorsement, PartyMember, TeamSummary } from './types';

interface SocialHubProps {
  party: {
    name: string;
    invitesOpen?: boolean;
    members: PartyMember[];
  };
  teams: TeamSummary[];
  endorsements: Endorsement[];
}

const SocialHub: React.FC<SocialHubProps> = ({ party, teams, endorsements }) => {
  return (
    <div className="space-y-6">
      <PartyPanel partyName={party.name} invitesOpen={party.invitesOpen} members={party.members} />
      <TeamShowcase teams={teams} />
      <EndorsementFeed endorsements={endorsements} />
    </div>
  );
};

export default SocialHub;
