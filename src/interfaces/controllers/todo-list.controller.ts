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
import { CreateTodoListDto } from '../dtos/create-todo-list.dto';
import { CreateTodoListCommand } from '../../application/commands/create-todo-list.command';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { GetTodoListQuery } from '../../application/queries/get-todo-list.query';
import { UpdateTodoListDto } from '../dtos/update-todo-list.dto';
import { UpdateTodoListCommand } from '../../application/commands/update-todo-list.command';
import { DeleteTodoListCommand } from '../../application/commands/delete-todo-list.command';

@Controller('todo-lists')
export class TodoListController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTodoList(
    @Request() req: any,
    @Body() createTodoListDto: CreateTodoListDto,
  ) {
    const userId = req.user.sub;
    return this.commandBus.execute(
      new CreateTodoListCommand(userId, createTodoListDto.title),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetTodoListQuery(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    return this.commandBus.execute(
      new UpdateTodoListCommand(id, updateTodoListDto.title),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteTodoListCommand(id));
  }
}
