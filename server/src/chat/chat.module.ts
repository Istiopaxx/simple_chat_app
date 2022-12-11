import { ChatRoomRepository } from './repositorys/chat-room.repository';
import { ChatMessageRepository } from './repositorys/chat-messgae.repository';
import { UserModule } from './../user/user.module';
import { ChatRoomService } from './services/chat-room.service';
import { ChatMessageService } from './services/chat-message.service';
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GlobalMessageSchema,
  PrivateMessageSchema,
} from './entities/message.entity';
import { ChatRoomSchema } from './entities/chat-room.entity';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'PrivateMessage', schema: PrivateMessageSchema },
      { name: 'GlobalMessage', schema: GlobalMessageSchema },
      { name: 'ChatRoom', schema: ChatRoomSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatMessageService,
    ChatRoomService,
    ChatMessageRepository,
    ChatRoomRepository,
  ],
})
export class ChatModule {}
