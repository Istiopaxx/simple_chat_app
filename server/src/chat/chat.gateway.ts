import { AuthService } from './../user/services/auth.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatMessageService } from './services/chat-message.service';
import { ChatRoomService } from './services/chat-room.service';
import { Socket, Server } from 'socket.io';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import {
  CreateGlobalMessageDto,
  CreatePrivateMessageDto,
} from './dto/create-message.dto';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  // transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private chatMessageService: ChatMessageService,
    private chatRoomService: ChatRoomService,
    private authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    const userId = await this.authService.validateSocket(client);
    await this.chatRoomService.joinAll(client, userId);
  }

  @SubscribeMessage('CreatePrivateRoom')
  async createPrivateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChatRoomDto: CreateChatRoomDto,
  ) {
    await this.chatRoomService.create(client, createChatRoomDto);
  }

  @SubscribeMessage('SendPrivateMessage')
  async sendPrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: CreatePrivateMessageDto,
  ) {
    await this.chatMessageService.createAndSendPrivate(
      client,
      createPrivateMessageDto,
    );
  }

  @SubscribeMessage('SendGlobalMessage')
  async sendGlobalMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createGlobalMessageDto: CreateGlobalMessageDto,
  ) {
    console.log(this.server.sockets);
    await this.chatMessageService.createAndSendGlobal(
      this.server,
      createGlobalMessageDto,
    );
  }
}
