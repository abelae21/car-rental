import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return this.sanitize(user);
  }

  async updateAvatar(id: string, avatarUrl: string) {
    const user = await this.prisma.user.update({ where: { id }, data: { avatarUrl } });
    return this.sanitize(user);
  }

  // --- Admin ---
  async findAll(params: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 20, search } = params;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { users: users.map((u) => this.sanitize(u)), total, skip, take };
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.prisma.user.update({ where: { id }, data: { isActive } });
    return this.sanitize(user);
  }

  private sanitize(user: Record<string, any>) {
    const {
      password,
      refreshTokenHash,
      emailVerificationToken,
      passwordResetToken,
      ...safe
    } = user;
    return safe;
  }
}
