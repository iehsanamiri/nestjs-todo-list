import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { TodoListRepository } from '../../../domain/repositories/todo-list.repository';
import { TodoList } from '../../../domain/entities/todo-list.entity';
import {
  TodoListDocument,
  todoListToDomain,
} from '../../database/schemas/todo-list.schema';

@Injectable()
export class MongooseTodoListRepository implements TodoListRepository {
  constructor(
    @InjectModel('TodoList') private todoListModel: Model<TodoListDocument>,
  ) {}

  async create(todoList: TodoList): Promise<TodoList> {
    let todoListDoc = new this.todoListModel({
      userId: todoList.userId,
      title: todoList.title,
    });
    todoListDoc = await todoListDoc.save();
    return todoListToDomain(todoListDoc);
  }

  async update(id: string, title: string): Promise<TodoList> {
    const todoListDoc = await this.todoListModel
      .findOneAndUpdate({ _id: id }, { title }, { new: true })
      .exec();
    return todoListToDomain(todoListDoc);
  }

  async findById(id: string): Promise<TodoList | null> {
    const todoListDoc = await this.todoListModel.findById(id).exec();
    return todoListDoc ? todoListToDomain(todoListDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.todoListModel.findByIdAndDelete(id).exec();
  }
}
