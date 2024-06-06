import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListQuery } from '../get-todo-list.query';
import { TodoListService } from '../../../domain/services/todo-list.service';

@QueryHandler(GetTodoListQuery)
export class GetTodoListHandler implements IQueryHandler<GetTodoListQuery> {
  constructor(private readonly todoListService: TodoListService) {}

  async execute(query: GetTodoListQuery) {
    return await this.todoListService.findById(query.id);
  }
}
