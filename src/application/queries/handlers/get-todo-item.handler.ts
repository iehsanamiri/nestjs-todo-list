import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TodoItemService } from '../../../domain/services/todo-item.service';
import { GetTodoItemQuery } from '../get-todo-item.query';

@QueryHandler(GetTodoItemQuery)
export class GetTodoItemHandler implements IQueryHandler<GetTodoItemQuery> {
  constructor(private readonly todoItemService: TodoItemService) {}

  async execute(query: GetTodoItemQuery) {
    return await this.todoItemService.findById(query.id);
  }
}
