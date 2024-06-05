import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from 'src/user/domain/services/user.service';
import { UserCreatedEvent } from '../../events/user-created.event';
import { UserDto } from '../../../interfaces/dtos/user.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
    const response = await this.userService.register(
      command.username,
      command.password,
    );
    const userContext = this.publisher.mergeObjectContext(response.user);
    userContext.apply(new UserCreatedEvent(response.user.id));
    userContext.commit();
    return {
      user: UserDto.fromUser(response.user),
      tokens: response.tokens
    };
  }
}
