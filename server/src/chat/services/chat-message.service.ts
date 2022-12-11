import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  CreateGlobalMessageDto,
  CreatePrivateMessageDto,
} from '../dto/create-message.dto';
import { ChatMessageRepository } from '../repositorys/chat-messgae.repository';

@Injectable()
export class ChatMessageService {
  constructor(private chatMessageRepository: ChatMessageRepository) {}

  async createAndSendPrivate(
    client: Socket,
    createPrivateMessageDto: CreatePrivateMessageDto,
  ) {
    const chatMessage = await this.chatMessageRepository.createPrivate(
      createPrivateMessageDto,
    );
    client.to(createPrivateMessageDto.room).emit('ReceiveMessage', chatMessage);
  }

  async createAndSendGlobal(
    client: Socket,
    createGlobalMessageDto: CreateGlobalMessageDto,
  ) {
    const chatMessage = await this.chatMessageRepository.createGlobal(
      createGlobalMessageDto,
    );
    client.emit('ReceiveMessage', chatMessage);
  }

  async getPrivateMessageList(chatRoomId: string) {
    return this.chatMessageRepository.findMessagesByRoomId(chatRoomId);
  }

  async getGlobalMessageList() {
    return this.chatMessageRepository.findAllGlobal();
  }
}
