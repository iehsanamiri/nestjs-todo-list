import { AggregateRoot } from '@nestjs/cqrs';
import { TodoList } from './todo-list.entity';

export class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public todoLists: TodoList[] = [],
  ) {
    super();
  }
}
