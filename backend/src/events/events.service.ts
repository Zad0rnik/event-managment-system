import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';
import {
  CreateEventDto,
  UpdateEventDto,
  QueryEventsDto,
} from './dto';

export interface PaginatedEvents {
  data: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SimilarEvent extends Event {
  similarityScore: number;
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryEventsDto): Promise<PaginatedEvents> {
    const { category, search, sortBy, sortOrder, page, limit } =
      query;

    const where: Prisma.EventWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { [sortBy || 'date']: sortOrder || 'asc' },
        skip: ((page || 1) - 1) * (limit || 10),
        take: limit || 10,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto
  ): Promise<Event> {
    await this.findOne(id);

    const data: Prisma.EventUpdateInput = { ...updateEventDto };
    if (updateEventDto.date) {
      data.date = new Date(updateEventDto.date);
    }

    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Event> {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async findSimilar(
    id: string,
    limit: number = 5
  ): Promise<SimilarEvent[]> {
    const event = await this.findOne(id);
    const allEvents = await this.prisma.event.findMany({
      where: { id: { not: id } },
    });

    const scoredEvents: SimilarEvent[] = allEvents.map(
      (otherEvent) => ({
        ...otherEvent,
        similarityScore: this.calculateSimilarity(event, otherEvent),
      })
    );

    return scoredEvents
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }

  private calculateSimilarity(event1: Event, event2: Event): number {
    let score = 0;

    // Same category: +50 points
    if (event1.category === event2.category) {
      score += 50;
    }

    // Date proximity: up to +30 points (linear decrease over 30 days)
    const daysDiff = Math.abs(
      (event1.date.getTime() - event2.date.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 30) {
      score += 30 * (1 - daysDiff / 30);
    }

    // Location proximity: up to +20 points (if coordinates available)
    if (
      event1.latitude != null &&
      event1.longitude != null &&
      event2.latitude != null &&
      event2.longitude != null
    ) {
      const distance = this.calculateDistance(
        event1.latitude,
        event1.longitude,
        event2.latitude,
        event2.longitude
      );

      // Within 50km gets max points, decreases linearly up to 500km
      if (distance <= 50) {
        score += 20;
      } else if (distance <= 500) {
        score += 20 * (1 - (distance - 50) / 450);
      }
    }

    return Math.round(score * 100) / 100;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
