import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongoSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const toObjectOptions = {
  transform: (doc: any, ret: any) => {
    delete ret.__v;
    return ret;
  },
  virtuals: true,
};

@Schema({
  timestamps: true,
  toObject: toObjectOptions,
  toJSON: toObjectOptions,
})
export class User {
  @Prop({
    require: true,
    type: mongoSchema.Types.ObjectId,
    auto: true,
  })
  _id: mongoSchema.Types.ObjectId;

  @Prop({ require: true })
  name: string;

  @Prop({ require: true })
  username: string;

  @Prop({ require: true })
  password: string;

  @Prop({ require: false })
  createdAt: Date;

  @Prop({ require: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
