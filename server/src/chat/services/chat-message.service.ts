import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import {
  CreateGlobalMessageDto,
  CreatePrivateMessageDto,
} from '../dto/create-message.dto';
import { ChatMessageRepository } from '../repositories/chat-messgae.repository';

@Injectable()
export class ChatMessageService {
  constructor(private chatMessageRepository: ChatMessageRepository) {}

  async createAndSendPrivate(
    server: Server,
    createPrivateMessageDto: CreatePrivateMessageDto,
  ) {
    const chatMessage = await this.chatMessageRepository.createPrivate(
      createPrivateMessageDto,
    );
    server.to(createPrivateMessageDto.room).emit('ReceiveMessage', chatMessage);
  }

  async createAndSendGlobal(
    server: Server,
    createGlobalMessageDto: CreateGlobalMessageDto,
  ) {
    const chatMessage = await this.chatMessageRepository.createGlobal(
      createGlobalMessageDto,
    );
    server.emit('ReceiveMessage', chatMessage);
  }

  async getPrivateMessageList(chatRoomId: string) {
    return this.chatMessageRepository.findMessagesByRoomId(chatRoomId);
  }

  async getGlobalMessageList() {
    return this.chatMessageRepository.findAllGlobal();
  }
}
