import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TodoItem as TodoItemEntity } from '../../../domain/entities/todo-item.entity';

@Schema()
export class TodoItem extends Document {
  @Prop({ required: true })
  todoListId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  priority: number;
}

export type TodoItemDocument = TodoItem & Document;
export const TodoItemSchema = SchemaFactory.createForClass(TodoItem);

export function todoItemToDomain(
  todoItemDoc: TodoItemDocument,
): TodoItemEntity {
  return new TodoItemEntity(
    todoItemDoc.id,
    todoItemDoc.todoListId,
    todoItemDoc.title,
    todoItemDoc.description,
    todoItemDoc.priority,
  );
}
