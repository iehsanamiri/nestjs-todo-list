import { TodoList } from './todo-list.entity';
import { AggregateRoot } from '@nestjs/cqrs';

export class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly todoLists: TodoList[] = [],
  ) {
    super();
  }
}
