import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDto } from '../../../interfaces/dtos/user.dto';
import { AuthService } from '../../../domain/services/auth.service';
import { LoginCommand } from '../login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand) {
    const response = await this.authService.login(
      command.username,
      command.password,
    );
    return {
      user: UserDto.fromUser(response.user),
      tokens: response.tokens,
    };
  }
}
