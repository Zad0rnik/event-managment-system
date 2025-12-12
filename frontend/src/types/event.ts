export enum Category {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  MEETUP = 'MEETUP',
  CONCERT = 'CONCERT',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface SimilarEvent extends Event {
  similarityScore: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  category: Category;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EventsQueryParams {
  category?: Category;
  search?: string;
  sortBy?: 'date' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const categoryLabels: Record<Category, string> = {
  [Category.CONFERENCE]: 'Conference',
  [Category.WORKSHOP]: 'Workshop',
  [Category.MEETUP]: 'Meetup',
  [Category.CONCERT]: 'Concert',
  [Category.SPORTS]: 'Sports',
  [Category.OTHER]: 'Other',
};

export const categoryColors: Record<Category, string> = {
  [Category.CONFERENCE]: '#6366f1',
  [Category.WORKSHOP]: '#8b5cf6',
  [Category.MEETUP]: '#ec4899',
  [Category.CONCERT]: '#f59e0b',
  [Category.SPORTS]: '#10b981',
  [Category.OTHER]: '#64748b',
};
