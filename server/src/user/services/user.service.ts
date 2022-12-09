import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService extends BaseService<User, CreateUserDto, any> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('HASH_SALT_ROUND')),
    );
    return await this.userRepository.create(createUserDto);
  }

  async findByUsername(username: string): Promise<User> {
    const ret = await this.userRepository.findByUsername(username);
    if (!ret) throw new NotFoundException('User not found');
    return ret;
  }
}
