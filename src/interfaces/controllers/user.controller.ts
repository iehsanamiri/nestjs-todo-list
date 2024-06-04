import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: { username: string; password: string },
  ) {
    await this.commandBus.execute(
      new CreateUserCommand(createUserDto.username, createUserDto.password),
    );
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.queryBus.execute(new GetUserQuery(id));
  }
}
