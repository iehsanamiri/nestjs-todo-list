import { TodoItem } from '../entities/todo-item.entity';

export interface TodoItemRepository {
  create(todoItem: TodoItem): Promise<TodoItem>;

  update(todoItem: TodoItem): Promise<TodoItem>;

  findById(id: string): Promise<TodoItem | null>;

  delete(id: string): Promise<void>;
}
