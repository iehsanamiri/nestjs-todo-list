import { TodoList } from './todo-list.entity';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly todoLists: TodoList[] = [],
  ) {}
}
