import React, { createContext, useContext, useMemo, useState } from 'react';

import { InventoryItem, LoadoutConfig, ProfileInventoryState } from './types';

interface InventoryContextValue extends ProfileInventoryState {
  equipItem(slotId: string, itemId: string): void;
  unequipItem(slotId: string): void;
  toggleEquip(itemId: string): void;
  updateInventory(items: InventoryItem[]): void;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

interface InventoryProviderProps {
  initialItems: InventoryItem[];
  loadoutTemplate: LoadoutConfig;
  children: React.ReactNode;
}

function markEquipped(items: InventoryItem[], loadout: LoadoutConfig): InventoryItem[] {
  const itemIds = new Set(loadout.slots.map((slot) => slot.itemId).filter(Boolean) as string[]);
  return items.map((item) => ({ ...item, equipped: itemIds.has(item.id) }));
}

export function InventoryProvider({ initialItems, loadoutTemplate, children }: InventoryProviderProps): JSX.Element {
  const [baseItems, setBaseItems] = useState<InventoryItem[]>(initialItems);
  const [loadout, setLoadout] = useState<LoadoutConfig>(loadoutTemplate);

  const items = useMemo(() => markEquipped(baseItems, loadout), [baseItems, loadout]);

  const value = useMemo<InventoryContextValue>(
    () => ({
      items,
      loadout,
      equipItem(slotId, itemId) {
        setLoadout((prev) => ({
          slots: prev.slots.map((slot) => (slot.id === slotId ? { ...slot, itemId } : slot)),
        }));
      },
      unequipItem(slotId) {
        setLoadout((prev) => ({
          slots: prev.slots.map((slot) => (slot.id === slotId ? { ...slot, itemId: undefined } : slot)),
        }));
      },
      toggleEquip(targetId) {
        setLoadout((prev) => {
          const slotWithItem = prev.slots.find((slot) => slot.itemId === targetId);
          if (slotWithItem) {
            return {
              slots: prev.slots.map((slot) =>
                slot.itemId === targetId ? { ...slot, itemId: undefined } : slot,
              ),
            };
          }

          const candidateSlot = prev.slots.find((slot) => {
            const item = baseItems.find((entry) => entry.id === targetId);
            return item ? slot.accepts.includes(item.type) : false;
          });

          if (!candidateSlot) {
            return prev;
          }

          return {
            slots: prev.slots.map((slot) =>
              slot.id === candidateSlot.id ? { ...slot, itemId: targetId } : slot,
            ),
          };
        });
      },
      updateInventory(nextItems) {
        setBaseItems(nextItems);
      },
    }),
    [items, loadout, baseItems],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const value = useContext(InventoryContext);
  if (!value) {
    throw new Error('useInventory must be used inside an InventoryProvider');
  }

  return value;
}
