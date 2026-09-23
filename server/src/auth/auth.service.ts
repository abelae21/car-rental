import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  // ---------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    const verifyUrl = `${this.config.get('clientUrl')}/verify-email?token=${verificationToken}`;
    await this.mail.sendVerificationEmail(user.email, user.firstName, verifyUrl);

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        type: 'REGISTRATION',
        title: 'Welcome to Car Rental!',
        message: 'Your account has been created. Please verify your email to get started.',
      },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  // ---------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid email or password');

    if (!user.isActive) throw new UnauthorizedException('This account has been deactivated');

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  // ---------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------
  async refreshTokens(userId: string, email: string, role: string) {
    const tokens = await this.issueTokens(userId, email, role);
    return tokens;
  }

  // ---------------------------------------------------------------------
  // Email verification
  // ---------------------------------------------------------------------
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({ where: { emailVerificationToken: token } });
    if (!user || !user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
      throw new BadRequestException('Verification link is invalid or has expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  // ---------------------------------------------------------------------
  // Forgot / reset password
  // ---------------------------------------------------------------------
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return a generic success message to avoid leaking which emails are registered.
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    });

    const resetUrl = `${this.config.get('clientUrl')}/reset-password?token=${resetToken}`;
    await this.mail.sendPasswordResetEmail(user.email, user.firstName, resetUrl);

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        title: 'Password reset requested',
        message: 'We sent you a link to reset your password.',
      },
    });

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { passwordResetToken: token } });
    if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        refreshTokenHash: null, // force re-login everywhere
      },
    });

    return { message: 'Password reset successfully. Please log in again.' };
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  private async issueTokens(userId: string, email: string, role: string): Promise<Tokens> {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('jwt.accessSecret'),
      expiresIn: this.config.get('jwt.accessExpiresIn'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });

    return { accessToken, refreshToken };
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
