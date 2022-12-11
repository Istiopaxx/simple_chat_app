import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as mongoSchema } from 'mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({
  timestamps: true,
})
export class ChatRoom {
  @Prop({ required: true, auto: true, type: mongoSchema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, type: [mongoSchema.Types.ObjectId], ref: 'User' })
  participants: Types.ObjectId[];

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
