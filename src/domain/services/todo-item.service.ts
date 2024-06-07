import { TodoListRepository } from '../repositories/todo-list.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TodoItemRepository } from '../repositories/todo-item.repository';
import { TodoItem } from '../entities/todo-item.entity';
import { UserRepository } from '../repositories/user.repository';
import { TodoList } from '../entities/todo-list.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(todoListId: string, title: string, description: string) {
    let todoList = await this.todoListRepository.findById(todoListId);

    const newPriority = this.getNewPriority(todoList.todoItems);
    const newTodoItem = await this.todoItemRepository.create(
      new TodoItem(null, todoListId, title, description, newPriority),
    );
    todoList.todoItems.push(newTodoItem);

    // update todoList
    todoList = await this.todoListRepository.update(todoList);

    // update user todoList
    await this.updateUserTodoList(todoList);

    return newTodoItem;
  }

  async findById(id: string) {
    const todoItem = await this.todoItemRepository.findById(id);
    if (!todoItem) {
      throw new NotFoundException('Not Found!');
    }
    return todoItem;
  }

  async update(todoItem: TodoItem): Promise<any> {
    const updatedTodoItem = await this.todoItemRepository.update(todoItem);
    let todoList = await this.todoListRepository.findById(
      updatedTodoItem.todoList,
    );

    if (todoList) {
      // update todoList
      const index = todoList.todoItems.findIndex(
        (todoItem) => todoItem.id == todoItem.id,
      );
      if (index >= 0) {
        todoList.todoItems[index] = updatedTodoItem;

        // SORT
        todoList.todoItems = this.sortTodoItems(todoList.todoItems);

        // UPDATE
        todoList = await this.todoListRepository.update(todoList);
      }

      // update user todoList
      await this.updateUserTodoList(todoList);
    }
    return updatedTodoItem;
  }

  async delete(id: string): Promise<any> {
    const todoItem = await this.findById(id);
    await this.todoItemRepository.delete(id);
    let todoList = await this.todoListRepository.findById(todoItem.todoList);
    if (todoList) {
      todoList.todoItems = todoList.todoItems.filter(
        (todoItem) => todoItem.id !== id,
      );
      todoList = await this.todoListRepository.update(todoList);

      // update user todoList
      await this.updateUserTodoList(todoList);
    }
  }

  private async updateUserTodoList(todoList: TodoList) {
    const user = await this.userRepository.findById(todoList.userId);
    const todoListIndex = user.todoLists.findIndex((e) => e.id == todoList.id);
    if (todoListIndex >= 0) {
      user.todoLists[todoListIndex] = todoList;
      await this.userRepository.update(user);
    }
  }

  private sortTodoItems(todoItems: TodoItem[]): TodoItem[] {
    todoItems.sort((a, b) => a.priority - b.priority);
    return todoItems;
  }

  private getNewPriority(todoItems: TodoItem[]) {
    if (todoItems.length == 0) {
      return 0;
    }
    return todoItems[todoItems.length - 1].priority + 1;
  }
}
