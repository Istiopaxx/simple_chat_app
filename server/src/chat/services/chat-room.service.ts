import { ChatRoomRepository } from '../repositorys/chat-room.repository';
import { ChatRoom } from '../entities/chat-room.entity';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { Socket } from 'socket.io';

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
    const roomList = await this.chatRoomRepository.findRoomByUserId(userId);
    roomList.forEach((room) => {
      client.join(room._id.toString());
    });
  }

  async findRoomByUserId(userId): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findRoomByUserId(userId);
  }
}
