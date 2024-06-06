import { TodoList } from '../entities/todo-list.entity';

export interface TodoListRepository {
  create(todoList: TodoList): Promise<TodoList>;

  update(id: string, title: string): Promise<TodoList>;

  findById(id: string): Promise<TodoList | null>;

  delete(id: string): Promise<void>;
}
