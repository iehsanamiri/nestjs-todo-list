import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/user/application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../../shared/guards/jwt-refresh-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterUserDto) {
    return await this.commandBus.execute(
      new CreateUserCommand(createUserDto.username, createUserDto.password),
    );
  }

  @Post('login')
  async login(@Body() createUserDto: LoginUserDto) {
    return await this.commandBus.execute(
      new CreateUserCommand(createUserDto.username, createUserDto.password),
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async findProfile(@Request() req: any) {
    const userId = req.user.sub;
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refreshTokens(@Request() req: any) {
    const userId = req.user.sub;
    // const refreshToken = req.user.refreshToken;
    // return this.authService.refreshTokens(userId);
  }
}
