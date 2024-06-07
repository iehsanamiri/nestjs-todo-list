import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TodoItemService } from '../../../domain/services/todo-item.service';
import { DeleteTodoItemCommand } from '../delete-todo-item.command';

@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemHandler
  implements ICommandHandler<DeleteTodoItemCommand>
{
  constructor(private readonly todoItemService: TodoItemService) {}

  async execute(command: DeleteTodoItemCommand) {
    const { id } = command;
    return await this.todoItemService.delete(id);
  }
}
