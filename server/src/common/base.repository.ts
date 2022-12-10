import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class BaseRepository<Entity, CreateDto, UpdateDto> {
  model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(createDto: CreateDto): Promise<Entity> {
    const createdEntity = new this.model(createDto);
    return await createdEntity.save();
  }

  async findAll(): Promise<Entity[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Entity> {
    return await this.model.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateDto): Promise<Entity> {
    return await this.model.findByIdAndUpdate(id, updateDto).exec();
  }

  async delete(id: string): Promise<Entity> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
