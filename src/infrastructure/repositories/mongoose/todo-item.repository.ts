import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoItemRepository } from '../../../domain/repositories/todo-item.repository';
import {
  TodoItem as DBTodoItem,
  TodoItemDocument,
  todoItemToDomain,
} from '../../database/schemas/todo-item.schema';
import { TodoItem } from '../../../domain/entities/todo-item.entity';

@Injectable()
export class MongooseTodoItemRepository implements TodoItemRepository {
  constructor(
    @InjectModel(DBTodoItem.name)
    private todoItemModel: Model<TodoItemDocument>,
  ) {}

  async create(todoItem: TodoItem): Promise<TodoItem> {
    let todoListDoc = new this.todoItemModel({
      todoListId: todoItem.todoList,
      title: todoItem.title,
      description: todoItem.description,
      priority: todoItem.priority,
    });
    todoListDoc = await todoListDoc.save();
    return todoItemToDomain(todoListDoc);
  }

  async update(todoItem: TodoItem): Promise<TodoItem> {
    const todoListDoc = await this.todoItemModel
      .findOneAndUpdate({ _id: todoItem.id }, todoItem, { new: true })
      .exec();
    return todoItemToDomain(todoListDoc);
  }

  async findById(id: string): Promise<TodoItem | null> {
    const todoItemDoc = await this.todoItemModel.findById(id).exec();
    return todoItemDoc ? todoItemToDomain(todoItemDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.todoItemModel.findByIdAndDelete(id).exec();
  }
}
