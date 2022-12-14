import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { ChatRoom, ChatRoomDocument } from '../entities/chat-room.entity';

export class ChatRoomRepository extends BaseRepository<
  ChatRoom,
  CreateChatRoomDto,
  any
> {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {
    super(chatRoomModel);
  }

  async findRoomByUserId(userId: string): Promise<ChatRoom[]> {
    return await this.chatRoomModel
      .find({
        participants: {
          $elemMatch: { $eq: userId },
        },
      })
      .populate('participants')
      .exec();
  }
}
