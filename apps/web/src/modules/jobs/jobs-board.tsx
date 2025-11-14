import React from 'react';

import { useJobFilters } from './use-job-filters';
import { JobPosting } from './types';

interface JobsBoardProps {
  jobs: JobPosting[];
  emptyState?: React.ReactNode;
}

export function JobsBoard({ jobs, emptyState }: JobsBoardProps): JSX.Element {
  const { filters, setFilters, filteredJobs, uniqueLocations, uniqueTags } = useJobFilters(jobs);

  return (
    <section className="jobs-board">
      <style>{jobsBoardStyles}</style>
      <header>
        <h2>Esports Job Board</h2>
        <p>Search open roles from verified teams, leagues, and gaming startups.</p>
      </header>

      <div className="controls">
        <label>
          Search
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Try 'coach' or 'broadcast producer'"
          />
        </label>

        <label>
          Commitment
          <select
            value={filters.commitment}
            onChange={(event) => setFilters((prev) => ({ ...prev, commitment: event.target.value as typeof filters.commitment }))}
          >
            <option value="any">Any commitment</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </label>

        <label>
          Location
          <select
            value={filters.location}
            onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
          >
            <option value="anywhere">Anywhere</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tag
          <select value={filters.tag} onChange={(event) => setFilters((prev) => ({ ...prev, tag: event.target.value }))}>
            <option value="all">All</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="job-results">
        {filteredJobs.map((job) => (
          <li key={job.id}>
            <article>
              <header>
                <h3>{job.title}</h3>
                <span>{job.org}</span>
              </header>
              <p>{job.description}</p>
              <footer>
                <span>{job.location}</span>
                <span>{job.commitment}</span>
                <time dateTime={job.publishedAt}>Posted {new Date(job.publishedAt).toLocaleDateString()}</time>
                <div className="tags">
                  {job.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button type="button">View details</button>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      {filteredJobs.length === 0 && (emptyState ?? <p className="empty">No openings match your filters yet.</p>)}
    </section>
  );
}

export const jobsBoardStyles = `
.jobs-board {
  display: grid;
  gap: 24px;
}

.jobs-board header h2 {
  margin-bottom: 4px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.controls label {
  display: grid;
  gap: 8px;
}

.controls input,
.controls select {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.35);
  color: inherit;
}

.job-results {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.job-results li article {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 20px;
  display: grid;
  gap: 12px;
}

.job-results article header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.job-results article footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.job-results article footer .tags {
  display: inline-flex;
  gap: 8px;
}

.job-results article footer .tags span {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.2);
}

.job-results article footer button {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0f172a;
  font-weight: 700;
}

.jobs-board .empty {
  text-align: center;
  color: rgba(148, 163, 184, 0.85);
}
`;
