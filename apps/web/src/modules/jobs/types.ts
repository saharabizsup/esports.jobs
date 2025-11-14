export interface JobPosting {
  id: string;
  title: string;
  org: string;
  location: string;
  commitment: 'full-time' | 'part-time' | 'contract' | 'freelance';
  description: string;
  tags: string[];
  publishedAt: string;
}

export interface JobFilterState {
  search: string;
  commitment: JobPosting['commitment'] | 'any';
  location: string;
  tag: string;
}
