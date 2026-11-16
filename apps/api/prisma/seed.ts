
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  BookingType,
} from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the Prisma seed.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting Venus Enterprises seed...');

  const categories = [
    { name: 'Design & Build', slug: 'design-build' },
    { name: 'Project Management', slug: 'project-management' },
    { name: 'Civil & Structural', slug: 'civil-structural' },
    { name: 'Electrical', slug: 'electrical' },
    { name: 'Audits', slug: 'audits' },
    { name: 'Facility Management', slug: 'facility-management' },
    { name: 'AMC', slug: 'amc' },
    { name: 'Automation', slug: 'automation' },
    { name: 'IT & Network', slug: 'it-network' },
    { name: 'Call-Out Services', slug: 'call-out' },
    { name: 'General Services', slug: 'general-services' },
    { name: 'Specialist Finishes', slug: 'specialist-finishes' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, isActive: true },
      create: category,
    });
  }

  const services = [
    {
      name: 'Commercial Refurbishment',
      slug: 'commercial-refurbishment',
      categorySlug: 'design-build',
      bookingType: BookingType.REQUEST_QUOTE,
    },
    {
      name: 'Project Planning',
      slug: 'project-planning',
      categorySlug: 'project-management',
      bookingType: BookingType.REQUEST_QUOTE,
    },
    {
      name: 'Electrical Maintenance',
      slug: 'electrical-maintenance',
      categorySlug: 'electrical',
      bookingType: BookingType.BOOK_VISIT,
    },
    {
      name: 'Energy Audit',
      slug: 'energy-audit',
      categorySlug: 'audits',
      bookingType: BookingType.ENQUIRY,
    },
    {
      name: 'HVAC AMC',
      slug: 'hvac-amc',
      categorySlug: 'amc',
      bookingType: BookingType.ENQUIRY,
    },
    {
      name: 'Home Automation',
      slug: 'home-automation',
      categorySlug: 'automation',
      bookingType: BookingType.REQUEST_QUOTE,
    },
    {
      name: 'Network Installation',
      slug: 'network-installation',
      categorySlug: 'it-network',
      bookingType: BookingType.REQUEST_QUOTE,
    },
    {
      name: 'Plumbing',
      slug: 'plumbing',
      categorySlug: 'call-out',
      bookingType: BookingType.BOOK_VISIT,
    },
  ];

  for (const service of services) {
    const { categorySlug, ...data } = service;

    await prisma.service.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        category: { connect: { slug: categorySlug } },
      },
      create: {
        ...data,
        category: { connect: { slug: categorySlug } },
      },
    });
  }

  await prisma.location.upsert({
    where: { slug: 'mumbai' },
    update: { isActive: true },
    create: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      slug: 'mumbai',
    },
  });

  console.log('Venus Enterprises seed completed!');
  console.log('12 categories created or updated.');
  console.log('8 services created or updated.');
  console.log('1 location created or updated.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
