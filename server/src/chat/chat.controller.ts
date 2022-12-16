import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ChatMessageService } from './services/chat-message.service';
import { ChatRoomService } from './services/chat-room.service';

@Controller('/chat')
export class ChatController {
  constructor(
    private chatRoomService: ChatRoomService,
    private chatMessageService: ChatMessageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/chatRoom')
  async getMyChatRoomList(@Req() req) {
    return this.chatRoomService.findRoomByUserId(req.user._id);
  }

  @Get('/privateMessage/:chatRoomId')
  async getPrivateMessageList(@Param('chatRoomId') chatRoomId: string) {
    console.log(chatRoomId);
    return this.chatMessageService.getPrivateMessageList(chatRoomId);
  }

  @Get('/globalMessage')
  async getGlobalMessageList() {
    return this.chatMessageService.getGlobalMessageList();
  }
}
