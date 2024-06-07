import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoItemCommand } from '../create-todo-item.command';
import { TodoItemService } from '../../../domain/services/todo-item.service';

@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemHandler
  implements ICommandHandler<CreateTodoItemCommand>
{
  constructor(private readonly todoItemService: TodoItemService) {}

  async execute(command: CreateTodoItemCommand) {
    const { todoListId, title, description } = command;
    return await this.todoItemService.create(todoListId, title, description);
  }
}
