import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('admin'))
  @Post('login')
  @ApiOperation({ summary: 'Method to login as an administrator.' })
  @ApiBody({
    description: 'User login',
    examples: {
      admin: {
        value: { username: 'admin', password: 'admin' },
        description: 'Basic example',
      },
    },
  })
  @ApiOkResponse({
    description: 'Administrator logged in',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {},
        },
        example: {
          access_token: '5KvKeFph7F0R8CRyDnjElCcUJR9MhY7kRtKofWSjtz8',
          user: {
            id: 'dde0bf54-5a2c-4bdf-b27d-4a638cb96798',
            name: 'Israel',
            surnames: 'Santiago Gutierrez',
            username: 'admin',
            createAt: '2024-01-10T00:03:52.421Z',
            updateAt: '2024-01-10T00:16:22.000Z',
            role: {
              id: 'a957b53f-4009-4437-aba3-77dd16d1aaea',
              name: 'Administrador',
              createAt: '2024-01-10T00:03:24.820Z',
              updateAt: '2024-01-10T00:03:24.820Z',
            },
            branch: {
              id: '2a799ef8-f8c5-4216-baae-4a829f479368',
              name: 'Sucursal San Cristobal',
              description: 'Sucursal San Cristobal',
              createAt: '2024-01-10T00:15:47.707Z',
              updateAt: '2024-03-11T04:40:02.128Z',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  loginAdministrator(@Req() req: Request) {
    const admin = req.user as User;
    return this.authService.generateJWTAdmin(admin);
  }
}
