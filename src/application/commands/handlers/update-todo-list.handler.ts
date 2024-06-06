import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TodoListService } from '../../../domain/services/todo-list.service';
import { UpdateTodoListCommand } from '../update-todo-list.command';

@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListHandler
  implements ICommandHandler<UpdateTodoListCommand>
{
  constructor(private readonly todoListService: TodoListService) {}

  async execute(command: UpdateTodoListCommand) {
    const { id, title } = command;
    return await this.todoListService.update(id, title);
  }
}
