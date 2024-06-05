import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { User } from 'src/user/domain/entities/user.entity';
import { UserService } from '../../../domain/services/user.service';
import { UserDto } from '../../../interfaces/dtos/user.dto';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery) {
    const user = await this.userService.findById(query.userId);
    return UserDto.fromUser(user);
  }
}
