import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginResDto } from '../dto/auth.dto';

@Injectable()
export class UserService extends BaseService<User, CreateUserDto, any> {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super(userRepository);
  }

  async register(createUserDto: CreateUserDto): Promise<LoginResDto> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('HASH_SALT_ROUND')),
    );
    const user = await this.userRepository.create(createUserDto);
    return await this.authService.login(user);
  }

  async findByUsername(username: string): Promise<User> {
    const ret = await this.userRepository.findByUsername(username);
    if (!ret) throw new NotFoundException('User not found');
    return ret;
  }
}
