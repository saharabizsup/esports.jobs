import { useMemo, useState } from 'react';

import { JobFilterState, JobPosting } from './types';

const defaultState: JobFilterState = {
  search: '',
  commitment: 'any',
  location: 'anywhere',
  tag: 'all',
};

export function useJobFilters(jobs: JobPosting[]) {
  const [filters, setFilters] = useState<JobFilterState>(defaultState);

  const filteredJobs = useMemo(() => {
    const lowerSearch = filters.search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (filters.commitment !== 'any' && job.commitment !== filters.commitment) {
        return false;
      }

      if (filters.location !== 'anywhere' && job.location !== filters.location) {
        return false;
      }

      if (filters.tag !== 'all' && !job.tags.includes(filters.tag)) {
        return false;
      }

      if (!lowerSearch) return true;
      return (
        job.title.toLowerCase().includes(lowerSearch) ||
        job.org.toLowerCase().includes(lowerSearch) ||
        job.description.toLowerCase().includes(lowerSearch)
      );
    });
  }, [jobs, filters]);

  const uniqueLocations = useMemo(() => Array.from(new Set(jobs.map((job) => job.location))).sort(), [jobs]);
  const uniqueTags = useMemo(
    () =>
      Array.from(
        new Set(
          jobs.reduce<string[]>((acc, job) => {
            acc.push(...job.tags);
            return acc;
          }, []),
        ),
      ).sort(),
    [jobs],
  );

  return {
    filters,
    setFilters,
    filteredJobs,
    uniqueLocations,
    uniqueTags,
  };
}
