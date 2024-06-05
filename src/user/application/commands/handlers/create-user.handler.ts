import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from 'src/user/domain/services/user.service';
import { UserCreatedEvent } from '../../events/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const user = await this.userService.register(
      command.username,
      command.password,
    );
    const userContext = this.publisher.mergeObjectContext(user);
    userContext.apply(new UserCreatedEvent(user.id));
    userContext.commit();
  }
}
