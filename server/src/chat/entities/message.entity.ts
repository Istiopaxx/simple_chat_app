import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as mongoSchema } from 'mongoose';

export type PrivateMessageDocument = PrivateMessage & Document;
export type GlobalMessageDocument = GlobalMessage & Document;

@Schema({
  timestamps: true,
})
export class PrivateMessage {
  @Prop({ required: true, auto: true, type: mongoSchema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, type: mongoSchema.Types.ObjectId, ref: 'ChatRoom' })
  room: mongoSchema.Types.ObjectId;

  @Prop({ required: true, type: mongoSchema.Types.ObjectId, ref: 'User' })
  from: mongoSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  createdAt: Date;
}

@Schema({
  timestamps: true,
})
export class GlobalMessage {
  @Prop({ required: true, auto: true, type: mongoSchema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, type: mongoSchema.Types.ObjectId, ref: 'User' })
  from: mongoSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  createdAt: Date;
}

export const PrivateMessageSchema =
  SchemaFactory.createForClass(PrivateMessage);
export const GlobalMessageSchema = SchemaFactory.createForClass(GlobalMessage);
