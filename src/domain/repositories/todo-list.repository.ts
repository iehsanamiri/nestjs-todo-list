import { TodoList } from '../entities/todo-list.entity';

export interface TodoListRepository {
  create(todoList: TodoList): Promise<TodoList>;

  update(todoList: TodoList): Promise<TodoList>;

  findById(id: string): Promise<TodoList | null>;

  delete(id: string): Promise<void>;
}
