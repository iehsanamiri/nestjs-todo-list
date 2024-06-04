import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { User } from 'src/domain/entities/user.entity';
import { UserService } from '../../../domain/services/user.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<User> {
    return await this.userService.findUser(query.userId);
  }
}
