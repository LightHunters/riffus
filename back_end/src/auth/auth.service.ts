import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req: any) {
    if (!req.user) {
      return {
        message: 'No user from google',
      };
    }

    const user = await this.usersService.findOrCreateUser(req.user);
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(id: string) {
    return this.usersService.findUserById(id);
  }
}
