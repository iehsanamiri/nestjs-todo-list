import { TodoItem } from './todo-item.entity';

export class TodoList {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly todoItems: TodoItem[] = [],
  ) {}
}
