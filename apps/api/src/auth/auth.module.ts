import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { RolesGuard } from './guards/roles.guard.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [SupabaseAuthGuard, RolesGuard],
  exports: [SupabaseAuthGuard, RolesGuard],
})
export class AuthModule {}
