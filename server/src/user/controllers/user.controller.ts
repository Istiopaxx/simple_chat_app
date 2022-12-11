import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
