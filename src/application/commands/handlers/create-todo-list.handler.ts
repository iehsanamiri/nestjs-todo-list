import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoListCommand } from '../create-todo-list.command';
import { TodoListService } from '../../../domain/services/todo-list.service';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler
  implements ICommandHandler<CreateTodoListCommand>
{
  constructor(private readonly todoListService: TodoListService) {}

  async execute(command: CreateTodoListCommand) {
    const { userId, title } = command;
    return await this.todoListService.create(userId, title);
  }
}
