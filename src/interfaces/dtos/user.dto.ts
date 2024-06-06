import { User } from '../../domain/entities/user.entity';
import { TodoList } from '../../domain/entities/todo-list.entity';

export class UserDto {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly todoLists: TodoList[] = [],
  ) {}

  static fromUser(user: User): UserDto {
    return new UserDto(user.id, user.username, user.todoLists);
  }
}
