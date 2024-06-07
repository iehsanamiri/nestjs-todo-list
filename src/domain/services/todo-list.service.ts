import { TodoListRepository } from '../repositories/todo-list.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoList } from '../entities/todo-list.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class TodoListService {
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(userId: string, title: string) {
    const user = await this.userRepository.findById(userId);

    const newTodoList = await this.todoListRepository.create(
      new TodoList(null, userId, title),
    );

    user.todoLists.push(newTodoList);
    await this.userRepository.update(user);
    return newTodoList;
  }

  async findById(id: string) {
    const todoList = await this.todoListRepository.findById(id);
    if (!todoList) {
      throw new NotFoundException('Not Found!');
    }
    return todoList;
  }

  async update(id: string, title: string): Promise<any> {
    let todoList = await this.findById(id);
    todoList.title = title;
    todoList = await this.todoListRepository.update(todoList);
    const user = await this.userRepository.findById(todoList.userId);
    if (user) {
      const index = user.todoLists.findIndex((todoList) => todoList.id == id);
      if (index >= 0) {
        user.todoLists[index] = todoList;
        await this.userRepository.update(user);
      }
    }
    return todoList;
  }

  async delete(id: string): Promise<any> {
    const todoList = await this.findById(id);
    if (todoList.todoItems.length > 0) {
      // We can change this logic like: force delete `todoList` and sub `todoItems`
      throw new BadRequestException(
        'You can not delete this todo list.\n because to do items is not empty, please move or delete sub items.',
      );
    }
    await this.todoListRepository.delete(id);
    const user = await this.userRepository.findById(todoList.userId);
    if (user) {
      user.todoLists = user.todoLists.filter((todoList) => todoList.id !== id);
      await this.userRepository.update(user);
    }
  }
}
