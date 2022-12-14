import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';

@Injectable()
export class BaseService<Entity, CreateDto, UpdateDto> {
  repository: any;
  constructor(repository: BaseRepository<Entity, CreateDto, UpdateDto>) {
    this.repository = repository;
  }

  async create(createDto: CreateDto): Promise<Entity> {
    return await this.repository.create(createDto);
  }

  async findAll(): Promise<Entity[]> {
    return await this.repository.findAll();
  }

  async findOne(id: string): Promise<Entity> {
    const ret = await this.repository.findOne(id);
    if (!ret) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return ret;
  }

  async update(id: string, updateDto: UpdateDto): Promise<Entity> {
    const ret = await this.repository.update(id, updateDto);
    if (!ret) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return ret;
  }

  async delete(id: string): Promise<Entity> {
    const ret = await this.repository.delete(id);
    if (!ret) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return ret;
  }
}
