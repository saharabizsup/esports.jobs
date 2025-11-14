export interface InventoryItem {
  id: string;
  name: string;
  type: 'cosmetic' | 'badge' | 'tool' | 'credential';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  equipped?: boolean;
  description?: string;
  tags?: string[];
}

export interface LoadoutSlot {
  id: string;
  label: string;
  accepts: InventoryItem['type'][];
  itemId?: string;
}

export interface LoadoutConfig {
  slots: LoadoutSlot[];
}

export interface ProfileInventoryState {
  items: InventoryItem[];
  loadout: LoadoutConfig;
}
