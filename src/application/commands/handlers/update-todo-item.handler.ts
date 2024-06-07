import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TodoItemService } from '../../../domain/services/todo-item.service';
import { UpdateTodoItemCommand } from '../update-todo-item.command';
import { TodoItem } from '../../../domain/entities/todo-item.entity';

@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemHandler
  implements ICommandHandler<UpdateTodoItemCommand>
{
  constructor(private readonly todoItemService: TodoItemService) {}

  async execute(command: UpdateTodoItemCommand) {
    const { id, todoListId, title, description, priority } = command;
    return await this.todoItemService.update(
      new TodoItem(id, todoListId, title, description, priority),
    );
  }
}
