'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { eventsApi } from '@/services/api';
import {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventsQueryParams,
} from '@/types';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: EventsQueryParams) =>
    [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  similar: (id: string) =>
    [...eventKeys.detail(id), 'similar'] as const,
};

export function useEvents(params?: EventsQueryParams) {
  return useQuery({
    queryKey: eventKeys.list(params || {}),
    queryFn: () => eventsApi.getAll(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

export function useSimilarEvents(id: string, limit?: number) {
  return useQuery({
    queryKey: eventKeys.similar(id),
    queryFn: () => eventsApi.getSimilar(id, limit),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: CreateEventInput) => eventsApi.create(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      event,
    }: {
      id: string;
      event: UpdateEventInput;
    }) => eventsApi.update(id, event),
    onSuccess: (data: Event) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(data.id),
      });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}
