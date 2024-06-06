import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from 'src/application/commands/register.command';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtRefreshAuthGuard } from '../../infrastructure/guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterUserDto) {
    return await this.commandBus.execute(
      new RegisterCommand(createUserDto.username, createUserDto.password),
    );
  }

  @Post('login')
  async login(@Body() createUserDto: LoginUserDto) {
    return await this.commandBus.execute(
      new RegisterCommand(createUserDto.username, createUserDto.password),
    );
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refreshTokens(@Request() req: any) {
    const userId = req.user.sub;
    console.log(`refresh token: ${userId}`);
    // const refreshToken = req.user.refreshToken;
    // return this.authService.refreshTokens(userId);
  }
}
