import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './application/modules/user.module';
import { AuthModule } from './application/modules/auth.module';
import { TodoListModule } from './application/modules/todo-list.module';
import { TodoItemModule } from './application/modules/todo-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    MongooseModule.forRoot('mongodb://root:todo1234@localhost:27017/nest', {
      authSource: 'admin',
    }),
    AuthModule,
    UserModule,
    TodoListModule,
    TodoItemModule,
  ],
})
export class AppModule {}
