import axios from 'axios';
import {
  Event,
  SimilarEvent,
  CreateEventInput,
  UpdateEventInput,
  PaginatedResponse,
  EventsQueryParams,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Remove empty/undefined values from params
const cleanParams = <T extends object>(
  params?: T
): Partial<T> | undefined => {
  if (!params) return undefined;
  const cleaned = {} as Partial<T>;
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      (cleaned as Record<string, unknown>)[key] = value;
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

export const eventsApi = {
  getAll: async (
    params?: EventsQueryParams
  ): Promise<PaginatedResponse<Event>> => {
    const { data } = await api.get<PaginatedResponse<Event>>(
      '/events',
      { params: cleanParams(params) }
    );
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  getSimilar: async (
    id: string,
    limit?: number
  ): Promise<SimilarEvent[]> => {
    const { data } = await api.get<SimilarEvent[]>(
      `/events/${id}/similar`,
      {
        params: { limit },
      }
    );
    return data;
  },

  create: async (event: CreateEventInput): Promise<Event> => {
    const { data } = await api.post<Event>('/events', event);
    return data;
  },

  update: async (
    id: string,
    event: UpdateEventInput
  ): Promise<Event> => {
    const { data } = await api.put<Event>(`/events/${id}`, event);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
