import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { ChatRoom } from '../entities/chat-room.entity';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRoomService {
  constructor(private chatRoomRepository: ChatRoomRepository) {}

  async create(
    client: Socket,
    createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.create(createChatRoomDto);
    client.join(chatRoom._id.toString());
    return chatRoom;
  }

  async joinAll(client: Socket, userId) {
    client.leave(client.id);
    const roomList = await this.chatRoomRepository.findRoomByUserId(userId);
    roomList.forEach((room) => {
      client.join(room._id.toString());
    });
  }

  async findRoomByUserId(userId): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findRoomByUserId(userId);
  }
}
