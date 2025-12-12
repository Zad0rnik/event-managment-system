import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    title: 'Tech Conference 2025',
    description:
      'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development. Join industry leaders for inspiring talks and networking opportunities.',
    date: new Date('2025-03-15T09:00:00Z'),
    location: 'San Francisco Convention Center',
    latitude: 37.7749,
    longitude: -122.4194,
    category: Category.CONFERENCE,
  },
  {
    title: 'React Workshop: Advanced Patterns',
    description:
      'Deep dive into advanced React patterns including custom hooks, render props, compound components, and state management strategies.',
    date: new Date('2025-02-20T14:00:00Z'),
    location: 'Tech Hub NYC',
    latitude: 40.7128,
    longitude: -74.006,
    category: Category.WORKSHOP,
  },
  {
    title: 'JavaScript Developers Meetup',
    description:
      'Monthly meetup for JavaScript enthusiasts. This month: Building performant applications with modern frameworks.',
    date: new Date('2025-01-25T18:30:00Z'),
    location: 'Downtown Coffee House, Seattle',
    latitude: 47.6062,
    longitude: -122.3321,
    category: Category.MEETUP,
  },
  {
    title: 'Summer Music Festival',
    description:
      'Three-day music festival featuring top artists from around the world. Multiple stages, food vendors, and camping available.',
    date: new Date('2025-07-10T12:00:00Z'),
    location: 'Central Park, New York',
    latitude: 40.7829,
    longitude: -73.9654,
    category: Category.CONCERT,
  },
  {
    title: 'City Marathon 2025',
    description:
      'Annual city marathon with 5K, 10K, half marathon, and full marathon options. All skill levels welcome.',
    date: new Date('2025-04-05T07:00:00Z'),
    location: 'Boston Common',
    latitude: 42.3601,
    longitude: -71.0589,
    category: Category.SPORTS,
  },
  {
    title: 'DevOps Summit',
    description:
      'Learn about CI/CD pipelines, container orchestration, and cloud infrastructure from DevOps experts.',
    date: new Date('2025-03-20T09:00:00Z'),
    location: 'Austin Convention Center',
    latitude: 30.2672,
    longitude: -97.7431,
    category: Category.CONFERENCE,
  },
  {
    title: 'Python Data Science Workshop',
    description:
      'Hands-on workshop covering pandas, numpy, and machine learning with scikit-learn.',
    date: new Date('2025-02-28T10:00:00Z'),
    location: 'Data Science Academy, Chicago',
    latitude: 41.8781,
    longitude: -87.6298,
    category: Category.WORKSHOP,
  },
  {
    title: 'Startup Networking Night',
    description:
      'Connect with founders, investors, and tech professionals. Pitch competitions and panel discussions included.',
    date: new Date('2025-01-30T19:00:00Z'),
    location: 'Innovation Hub, San Jose',
    latitude: 37.3382,
    longitude: -121.8863,
    category: Category.MEETUP,
  },
  {
    title: 'Jazz in the Park',
    description:
      'Free outdoor jazz concert featuring local and international jazz musicians.',
    date: new Date('2025-06-15T17:00:00Z'),
    location: 'Millennium Park, Chicago',
    latitude: 41.8826,
    longitude: -87.6226,
    category: Category.CONCERT,
  },
  {
    title: 'Beach Volleyball Tournament',
    description:
      'Amateur beach volleyball tournament. Teams of 2 or 4 players welcome.',
    date: new Date('2025-05-20T09:00:00Z'),
    location: 'Santa Monica Beach',
    latitude: 34.0195,
    longitude: -118.4912,
    category: Category.SPORTS,
  },
  {
    title: 'Cloud Computing Masterclass',
    description:
      'Comprehensive masterclass on AWS, Azure, and GCP. Learn to architect scalable cloud solutions.',
    date: new Date('2025-03-25T09:00:00Z'),
    location: 'Tech Campus, Denver',
    latitude: 39.7392,
    longitude: -104.9903,
    category: Category.WORKSHOP,
  },
  {
    title: 'Community Hackathon',
    description:
      '48-hour hackathon focused on building solutions for local community challenges. Prizes and mentorship provided.',
    date: new Date('2025-04-12T08:00:00Z'),
    location: 'University Tech Center, Portland',
    latitude: 45.5152,
    longitude: -122.6784,
    category: Category.OTHER,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log(`Seeded ${events.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
