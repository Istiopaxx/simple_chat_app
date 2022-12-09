import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FileModule,
    ChatModule,
  ],
})
export class AppModule { }
