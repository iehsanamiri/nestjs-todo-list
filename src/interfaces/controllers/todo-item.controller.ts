import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CreateTodoItemCommand } from '../../application/commands/create-todo-item.command';
import { GetTodoItemQuery } from '../../application/queries/get-todo-item.query';
import { CreateTodoItemDto } from '../dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dtos/update-todo-item.dto';
import { UpdateTodoItemCommand } from '../../application/commands/update-todo-item.command';
import { DeleteTodoItemCommand } from '../../application/commands/delete-todo-item.command';

@Controller('todo-items')
export class TodoItemController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTodoList(
    @Request() req: any,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ) {
    return this.commandBus.execute(
      new CreateTodoItemCommand(
        createTodoItemDto.todoListId,
        createTodoItemDto.title,
        createTodoItemDto.description,
      ),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetTodoItemQuery(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return this.commandBus.execute(
      new UpdateTodoItemCommand(
        id,
        updateTodoItemDto.todoListId,
        updateTodoItemDto.title,
        updateTodoItemDto.description,
        updateTodoItemDto.priority,
      ),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteTodoItemCommand(id));
  }
}
