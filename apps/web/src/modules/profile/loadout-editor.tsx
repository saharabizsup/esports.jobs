import React, { useId } from 'react';

import { useInventory } from './inventory-manager';

export function LoadoutEditor(): JSX.Element {
  const { loadout, items, equipItem, unequipItem } = useInventory();
  const sectionId = useId();
  const descriptionId = `${sectionId}-description`;

  return (
    <section className="loadout" aria-labelledby={sectionId} aria-describedby={descriptionId}>
      <style>{loadoutEditorStyles}</style>
      <header>
        <h2 id={sectionId}>Your showcase loadout</h2>
        <p id={descriptionId}>
          Highlight up to four achievements, credentials, or cosmetics that represent your esports identity.
        </p>
      </header>

      <div className="loadout-grid">
        {loadout.slots.map((slot) => {
          const equippedItem = items.find((item) => item.id === slot.itemId);
          return (
            <article
              className="slot"
              key={slot.id}
              aria-labelledby={`${slot.id}-label`}
              aria-describedby={`${slot.id}-requirements`}
            >
              <header>
                <h3 id={`${slot.id}-label`}>{slot.label}</h3>
                <span id={`${slot.id}-requirements`}>
                  Accepts: {slot.accepts.join(', ')}
                </span>
              </header>

              {equippedItem ? (
                <div className={`card ${equippedItem.rarity}`}>
                  <strong>{equippedItem.name}</strong>
                  <p>{equippedItem.description}</p>
                  <footer>
                    <button
                      type="button"
                      onClick={() => unequipItem(slot.id)}
                      aria-label={`Unequip ${equippedItem.name} from ${slot.label}`}
                    >
                      Unequip
                    </button>
                  </footer>
                </div>
              ) : (
                <div className="empty">
                  <p>Select an item from your inventory</p>
                  <select
                    onChange={(event) => equipItem(slot.id, event.target.value)}
                    value={slot.itemId ?? ''}
                    aria-label={`Equip an item in the ${slot.label} slot`}
                    aria-describedby={`${slot.id}-requirements`}
                  >
                    <option value="">Choose item</option>
                    {items
                      .filter((item) => slot.accepts.includes(item.type))
                      .map((item) => (
                        <option value={item.id} key={item.id} disabled={item.equipped}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export const loadoutEditorStyles = `
.loadout {
  display: grid;
  gap: 24px;
}

.loadout header h2 {
  margin-bottom: 4px;
}

.loadout-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.slot {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  display: grid;
  gap: 16px;
}

.slot header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.8);
}

.card {
  background: rgba(30, 41, 59, 0.75);
  padding: 16px;
  border-radius: 16px;
  display: grid;
  gap: 12px;
}

.card.epic {
  border: 1px solid #a855f7;
}

.card.legendary {
  border: 1px solid #fbbf24;
}

.card footer {
  display: flex;
  justify-content: flex-end;
}

.card button,
.empty select {
  border-radius: 999px;
  padding: 10px 18px;
  border: none;
  background: linear-gradient(135deg, #f97316, #fb7185);
  color: #0f172a;
  font-weight: 700;
}

.empty {
  display: grid;
  gap: 12px;
  text-align: center;
}

.empty select {
  align-self: center;
}
`;
