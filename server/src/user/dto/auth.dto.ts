import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResDto {
  user: User;

  access_token: string;
}
