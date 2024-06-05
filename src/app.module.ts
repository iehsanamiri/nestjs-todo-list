import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    MongooseModule.forRoot('mongodb://root:todo1234@localhost:27017/nest', {
      authSource: 'admin',
    }),
    UserModule,
  ],
})
export class AppModule {}
