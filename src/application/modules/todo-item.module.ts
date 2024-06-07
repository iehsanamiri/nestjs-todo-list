import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TodoList,
  TodoListSchema,
} from '../../infrastructure/database/schemas/todo-list.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseTodoListRepository } from '../../infrastructure/repositories/mongoose/todo-list.repository';
import { MongooseTodoItemRepository } from '../../infrastructure/repositories/mongoose/todo-item.repository';
import { TodoItemController } from '../../interfaces/controllers/todo-item.controller';
import { TodoItemService } from '../../domain/services/todo-item.service';
import { DeleteTodoItemHandler } from '../commands/handlers/delete-todo-item.handler';
import { CreateTodoItemHandler } from '../commands/handlers/create-todo-item.handler';
import { UpdateTodoItemHandler } from '../commands/handlers/update-todo-item.handler';
import { GetTodoItemHandler } from '../queries/handlers/get-todo-item.handler';
import { TodoItem, TodoItemSchema } from '../../infrastructure/database/schemas/todo-item.schema';
import { MongooseUserRepository } from '../../infrastructure/repositories/mongoose/user.repository';
import { User, UserSchema } from '../../infrastructure/database/schemas/user.schema';

export const CommandHandlers = [
  CreateTodoItemHandler,
  UpdateTodoItemHandler,
  DeleteTodoItemHandler,
];

export const EventHandlers = [];

export const QueryHandlers = [GetTodoItemHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoList.name, schema: TodoListSchema },
    ]),
    MongooseModule.forFeature([{ name: TodoItem.name, schema: TodoItemSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  controllers: [TodoItemController],
  providers: [
    {
      provide: 'TodoListRepository',
      useClass: MongooseTodoListRepository,
    },
    {
      provide: 'TodoItemRepository',
      useClass: MongooseTodoItemRepository,
    },
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepository,
    },
    TodoItemService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class TodoItemModule {}
