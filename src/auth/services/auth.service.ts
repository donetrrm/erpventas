import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { PayloadTokenAdmin } from '../models/token.model';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.userService.findByUsername(username);
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        return admin;
      }
    }
    return null;
  }

  generateJWTAdmin(user: User) {
    const payload: PayloadTokenAdmin = {
      user_id: user.id,
      role: user.role,
      branch: user.branch,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
