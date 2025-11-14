import React, { useId, useMemo, useRef, useState } from 'react';

import { useInventory } from './inventory-manager';

const filters = ['all', 'cosmetic', 'badge', 'tool', 'credential'] as const;
type FilterValue = (typeof filters)[number];

export function InventoryPanel(): JSX.Element {
  const { items, toggleEquip } = useInventory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
  const headingId = useId();
  const descriptionId = `${headingId}-description`;
  const searchId = `${headingId}-search`;
  const filterHelpTextId = `${headingId}-filters`;
  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredItems = useMemo(() => {
    const lower = search.toLowerCase();
    return items.filter((item) => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (!lower) return true;
      return (
        item.name.toLowerCase().includes(lower) ||
        (item.description?.toLowerCase().includes(lower) ?? false) ||
        (item.tags?.some((tag) => tag.toLowerCase().includes(lower)) ?? false)
      );
    });
  }, [items, search, filter]);

  const handleFilterKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + filters.length) % filters.length;
    const nextFilter = filters[nextIndex];
    setFilter(nextFilter);
    filterRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      className="inventory-panel"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <style>{inventoryPanelStyles}</style>
      <header>
        <h2 id={headingId}>Inventory</h2>
        <p id={descriptionId}>
          Manage everything you have unlocked from XP drops, scrims, and verified events.
        </p>
      </header>

      <div className="toolbar">
        <label className="sr-only" htmlFor={searchId}>
          Search inventory items
        </label>
        <input
          type="search"
          id={searchId}
          placeholder="Search items"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-describedby={filterHelpTextId}
          aria-label="Search inventory items"
        />

        <p id={filterHelpTextId} className="sr-only">
          Filter items by type. Use left and right arrow keys to move between filter options.
        </p>

        <div
          className="filters"
          role="radiogroup"
          aria-label="Filter inventory by item type"
        >
          {filters.map((value) => (
            <button
              type="button"
              key={value}
              data-active={filter === value}
              onClick={() => setFilter(value)}
              role="radio"
              aria-checked={filter === value}
              ref={(element) => {
                const index = filters.indexOf(value);
                filterRefs.current[index] = element;
              }}
              onKeyDown={(event) =>
                handleFilterKeyDown(event, filters.indexOf(value))
              }
              aria-label={
                value === 'all'
                  ? 'Show all items'
                  : `Show only ${value} items`
              }
            >
              {value === 'all' ? 'All items' : value}
            </button>
          ))}
        </div>
      </div>

      <ul className="inventory" aria-live="polite" aria-busy={false}>
        {filteredItems.map((item) => (
          <li key={item.id} className={`rarity-${item.rarity}`}>
            <div>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </div>
            <footer>
              <span>{item.type}</span>
              <button type="button" onClick={() => toggleEquip(item.id)}>
                {item.equipped ? 'Remove from loadout' : 'Add to loadout'}
              </button>
            </footer>
          </li>
        ))}
      </ul>

      {filteredItems.length === 0 && (
        <p className="empty" role="status" aria-live="polite">
          No items match your filters yet.
        </p>
      )}
    </section>
  );
}

export const inventoryPanelStyles = `
.inventory-panel {
  display: grid;
  gap: 20px;
}

.inventory-panel header h2 {
  margin-bottom: 4px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.toolbar input[type='search'] {
  flex: 1 1 220px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.35);
  color: inherit;
}

.toolbar input[type='search']:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.6);
  outline-offset: 2px;
}

.filters {
  display: inline-flex;
  gap: 8px;
}

.filters button {
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid transparent;
  color: inherit;
}

.filters button:focus-visible {
  outline: 3px solid rgba(45, 212, 191, 0.75);
  outline-offset: 2px;
}

.filters button[data-active='true'] {
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: #0f172a;
}

.inventory {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.inventory li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.inventory li footer {
  display: flex;
  gap: 12px;
  align-items: center;
}

.inventory li button {
  border-radius: 999px;
  padding: 8px 18px;
  border: none;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0f172a;
  font-weight: 700;
}

.inventory li button:focus-visible {
  outline: 3px solid rgba(34, 197, 94, 0.6);
  outline-offset: 2px;
}

.inventory li.rarity-epic {
  border-color: rgba(168, 85, 247, 0.6);
}

.inventory li.rarity-legendary {
  border-color: rgba(251, 191, 36, 0.6);
}

.inventory-panel .empty {
  text-align: center;
  color: rgba(148, 163, 184, 0.85);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
