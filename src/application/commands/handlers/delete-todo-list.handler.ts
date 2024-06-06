import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TodoListService } from '../../../domain/services/todo-list.service';
import { DeleteTodoListCommand } from '../delete-todo-list.command';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListHandler
  implements ICommandHandler<DeleteTodoListCommand>
{
  constructor(private readonly todoListService: TodoListService) {}

  async execute(command: DeleteTodoListCommand) {
    const { id } = command;
    return await this.todoListService.delete(id);
  }
}
