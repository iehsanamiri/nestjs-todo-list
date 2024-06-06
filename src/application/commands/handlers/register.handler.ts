import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../register.command';
import { UserRegisteredEvent } from '../../events/user-registered.event';
import { UserDto } from '../../../interfaces/dtos/user.dto';
import { AuthService } from '../../../domain/services/auth.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterCommand) {
    const response = await this.authService.register(
      command.username,
      command.password,
    );
    const userContext = this.publisher.mergeObjectContext(response.user);
    userContext.apply(new UserRegisteredEvent(response.user.id));
    userContext.commit();
    return {
      user: UserDto.fromUser(response.user),
      tokens: response.tokens,
    };
  }
}
