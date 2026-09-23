import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Utility to wipe all tables — intended for test environments only.
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase() cannot run in production');
    }
    const tables = [
      'notifications',
      'favorites',
      'reviews',
      'payments',
      'bookings',
      'vehicle_images',
      'vehicles',
      'coupons',
      'users',
    ];
    for (const table of tables) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
  }
}
