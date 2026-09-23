import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Attach allowed roles to a route handler, e.g. @Roles(Role.ADMIN)
 * Used in conjunction with RolesGuard.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
