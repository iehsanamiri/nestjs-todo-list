import { TodoItem } from './todo-item.entity';

export class TodoList {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public todoItems: TodoItem[] = [],
  ) {}
}
