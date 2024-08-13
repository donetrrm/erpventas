import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import {
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('admin'))
  @Post('login')
  loginAdministrator(@Req() req: Request) {
    const admin = req.user as User;
    return this.authService.generateJWTAdmin(admin);
  }
}
