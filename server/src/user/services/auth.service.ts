import { Socket } from 'socket.io';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, rawPassword: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(rawPassword, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    console.log(user);
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateSocket(client: Socket) {
    const token = client.handshake.auth.token.split(' ')[1];
    const { sub: userId } = await this.jwtService.verify(token);
    client.data.userId = userId;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user._id;
  }
}
