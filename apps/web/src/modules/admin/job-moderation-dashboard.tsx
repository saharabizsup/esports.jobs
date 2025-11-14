import React, { FormEvent, useMemo, useState } from 'react';

import { ModerationAction, ModerationJobPosting, ModerationStatus } from './types';

interface JobModerationDashboardProps {
  jobs: ModerationJobPosting[];
  onModerate(jobId: string, action: ModerationAction): Promise<void> | void;
}

const statusFilters: Array<ModerationStatus | 'all'> = ['all', 'pending', 'approved', 'rejected'];

export function JobModerationDashboard({ jobs, onModerate }: JobModerationDashboardProps): JSX.Element {
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>('pending');
  const [selected, setSelected] = useState<ModerationJobPosting | null>(null);
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<ModerationAction['decision']>('approved');
  const [moderator, setModerator] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => (filter === 'all' ? true : job.status === filter));
  }, [jobs, filter]);

  function selectJob(job: ModerationJobPosting) {
    setSelected(job);
    setNotes(job.notes ?? '');
    setDecision(job.status === 'pending' ? 'approved' : (job.status as ModerationAction['decision']));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !moderator) {
      setError('Select a job and identify yourself before moderating.');
      return;
    }

    const action: ModerationAction = {
      moderator,
      decision,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    setBusy(true);
    setError(undefined);
    Promise.resolve(onModerate(selected.id, action))
      .then(() => {
        setBusy(false);
        setSelected(null);
        setNotes('');
      })
      .catch((err) => {
        console.error('Moderation failed', err);
        setError('Could not update job. Try again.');
        setBusy(false);
      });
  }

  return (
    <div className="moderation-dashboard">
      <style>{moderationDashboardStyles}</style>
      <aside>
        <header>
          <h2>Job submissions</h2>
          <p>Review pending jobs before they go live.</p>
        </header>

        <div className="filters">
          {statusFilters.map((value) => (
            <button key={value} type="button" data-active={filter === value} onClick={() => setFilter(value)}>
              {value === 'all' ? 'All' : value}
            </button>
          ))}
        </div>

        <ul className="job-list">
          {filteredJobs.map((job) => (
            <li key={job.id} data-active={selected?.id === job.id}>
              <button type="button" onClick={() => selectJob(job)}>
                <strong>{job.title}</strong>
                <span>{job.org}</span>
                <small>{new Date(job.submittedAt).toLocaleString()}</small>
              </button>
            </li>
          ))}
        </ul>

        {filteredJobs.length === 0 && <p className="empty">No jobs in this filter.</p>}
      </aside>

      <section className="review-panel">
        <header>
          <h2>Review details</h2>
          <p>Select a job to approve or reject it. Approved jobs publish immediately.</p>
        </header>

        {selected ? (
          <form onSubmit={handleSubmit}>
            <article className="job-preview">
              <header>
                <h3>{selected.title}</h3>
                <span>{selected.org}</span>
              </header>
              <p>Submitted by {selected.submittedBy}</p>
              <div className="tags">
                {selected.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p>Status: {selected.status}</p>
            </article>

            <label>
              Moderator handle
              <input value={moderator} onChange={(event) => setModerator(event.target.value)} required />
            </label>

            <div className="decision">
              <label>
                <input
                  type="radio"
                  name="decision"
                  value="approved"
                  checked={decision === 'approved'}
                  onChange={() => setDecision('approved')}
                />
                Approve & publish
              </label>
              <label>
                <input
                  type="radio"
                  name="decision"
                  value="rejected"
                  checked={decision === 'rejected'}
                  onChange={() => setDecision('rejected')}
                />
                Reject & send feedback
              </label>
            </div>

            <label>
              Notes (shared with submitter)
              <textarea value={notes} rows={4} onChange={(event) => setNotes(event.target.value)} />
            </label>

            {error && <p role="alert">{error}</p>}

            <footer>
              <button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Submit decision'}
              </button>
            </footer>
          </form>
        ) : (
          <p className="empty">Select a job from the list to begin moderation.</p>
        )}
      </section>
    </div>
  );
}

export const moderationDashboardStyles = `
.moderation-dashboard {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(240px, 320px) 1fr;
}

@media (max-width: 960px) {
  .moderation-dashboard {
    grid-template-columns: 1fr;
  }
}

.moderation-dashboard aside {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 20px;
  padding: 20px;
  display: grid;
  gap: 16px;
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.filters {
  display: inline-flex;
  gap: 8px;
}

.filters button {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(30, 41, 59, 0.6);
  color: inherit;
}

.filters button[data-active='true'] {
  background: linear-gradient(135deg, #f97316, #fb7185);
  color: #0f172a;
}

.job-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.job-list li button {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.65);
  color: inherit;
  display: grid;
  gap: 4px;
  text-align: left;
}

.job-list li[data-active='true'] button {
  border-color: rgba(14, 165, 233, 0.85);
}

.review-panel {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 20px;
  padding: 24px;
  display: grid;
  gap: 16px;
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.review-panel form {
  display: grid;
  gap: 16px;
}

.review-panel input,
.review-panel textarea {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.35);
  color: inherit;
}

.decision {
  display: inline-flex;
  gap: 16px;
}

.job-preview {
  background: rgba(30, 41, 59, 0.65);
  padding: 16px;
  border-radius: 16px;
  display: grid;
  gap: 8px;
}

.job-preview .tags {
  display: inline-flex;
  gap: 8px;
}

.job-preview .tags span {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.25);
}

.review-panel footer {
  display: flex;
  justify-content: flex-end;
}

.review-panel button {
  border-radius: 999px;
  border: none;
  padding: 12px 22px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: #0f172a;
  font-weight: 700;
}

.moderation-dashboard .empty {
  text-align: center;
  color: rgba(148, 163, 184, 0.85);
}
`;
