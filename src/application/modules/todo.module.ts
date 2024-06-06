import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TodoList,
  TodoListSchema,
} from '../../infrastructure/database/schemas/todo-list.schema';
import { TodoListController } from '../../interfaces/controllers/todo-list.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TodoListService } from '../../domain/services/todo-list.service';
import { TodoListSagas } from '../sagas/todo-list.sagas';
import { CreateTodoListHandler } from '../commands/handlers/create-todo-list.handler';
import { MongooseTodoListRepository } from '../../infrastructure/repositories/mongoose/todo-list.repository';
import { MongooseUserRepository } from '../../infrastructure/repositories/mongoose/user.repository';
import {
  User,
  UserSchema,
} from '../../infrastructure/database/schemas/user.schema';
import { UpdateTodoListHandler } from '../commands/handlers/update-todo-list.handler';
import { DeleteTodoListHandler } from '../commands/handlers/delete-todo-list.handler';
import { GetTodoListHandler } from '../queries/handlers/get-todo-list.handler';

export const CommandHandlers = [
  CreateTodoListHandler,
  UpdateTodoListHandler,
  DeleteTodoListHandler,
];

export const EventHandlers = [];

export const QueryHandlers = [GetTodoListHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoList.name, schema: TodoListSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  controllers: [TodoListController],
  providers: [
    {
      provide: 'TodoListRepository',
      useClass: MongooseTodoListRepository,
    },
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepository,
    },
    TodoListService,
    TodoListSagas,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class TodoModule {}
