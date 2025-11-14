import React from 'react';

import { InventoryProvider } from './inventory-manager';
import { InventoryPanel } from './inventory-panel';
import { LoadoutEditor } from './loadout-editor';
import { InventoryItem, LoadoutConfig } from './types';

interface ProfileDashboardProps {
  items: InventoryItem[];
  loadout: LoadoutConfig;
}

export function ProfileDashboard({ items, loadout }: ProfileDashboardProps): JSX.Element {
  return (
    <InventoryProvider initialItems={items} loadoutTemplate={loadout}>
      <div className="profile-dashboard">
        <style>{profileDashboardStyles}</style>
        <LoadoutEditor />
        <InventoryPanel />
      </div>
    </InventoryProvider>
  );
}

export const profileDashboardStyles = `
.profile-dashboard {
  display: grid;
  gap: 32px;
}
`;
