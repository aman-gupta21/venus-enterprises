import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CommonModule } from './common/common.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ServicesModule } from './services/services.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { AvailabilityModule } from './availability/availability.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { EnquiriesModule } from './enquiries/enquiries.module.js';
import { QuotationsModule } from './quotations/quotations.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { CertificationsModule } from './certifications/certifications.module.js';
import { FaqsModule } from './faqs/faqs.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ServicesModule,
    LocationsModule,
    AddressesModule,
    AvailabilityModule,
    BookingsModule,
    EnquiriesModule,
    QuotationsModule,
    PaymentsModule,
    NotificationsModule,
    ReviewsModule,
    ClientsModule,
    ProjectsModule,
    CertificationsModule,
    FaqsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
