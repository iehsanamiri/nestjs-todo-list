import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async findProfile(@Request() req: any) {
    const userId = req.user.sub;
    return await this.queryBus.execute(new GetUserQuery(userId));
  }
}
