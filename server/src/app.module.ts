import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 1 minute
        limit: 100, // 100 requests / minute / IP as a baseline
      },
    ]),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    // Phase 2+: VehiclesModule, BookingsModule, PaymentsModule,
    // ReviewsModule, FavoritesModule, NotificationsModule, CouponsModule
  ],
})
export class AppModule {}
