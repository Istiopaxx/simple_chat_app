import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateGlobalMessageDto,
  CreatePrivateMessageDto,
} from '../dto/create-message.dto';
import {
  GlobalMessage,
  PrivateMessage,
  PrivateMessageDocument,
} from '../entities/message.entity';

@Injectable()
export class ChatMessageRepository {
  constructor(
    @InjectModel(PrivateMessage.name)
    private PrivateMessageModel: Model<PrivateMessageDocument>,
    @InjectModel(GlobalMessage.name)
    private globalMessageModel: Model<PrivateMessageDocument>,
  ) {}

  async createPrivate(
    createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<PrivateMessage> {
    const createdPrivateMessage = new this.PrivateMessageModel(
      createPrivateMessageDto,
    );
    const message = await createdPrivateMessage.save();
    return await this.PrivateMessageModel.findById(message._id)
      .populate('from')
      .exec();
  }

  async createGlobal(
    createGlobalMessageDto: CreateGlobalMessageDto,
  ): Promise<GlobalMessage> {
    const createdGlobalMessage = new this.globalMessageModel(
      createGlobalMessageDto,
    );
    const message = await createdGlobalMessage.save();
    return await this.globalMessageModel
      .findById(message._id)
      .populate('from')
      .exec();
  }

  async findAllPrivate(): Promise<PrivateMessage[]> {
    return await this.PrivateMessageModel.find().exec();
  }

  async findAllGlobal(): Promise<GlobalMessage[]> {
    return await this.globalMessageModel.find().populate('from').exec();
  }

  async findMessagesByRoomId(chatRoomId: string) {
    return await this.PrivateMessageModel.find({
      room: chatRoomId,
    }).exec();
  }
}
