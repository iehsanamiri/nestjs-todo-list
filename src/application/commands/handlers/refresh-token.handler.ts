import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../domain/services/auth.service';
import { RefreshTokenCommand } from '../refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RefreshTokenCommand) {
    const response = await this.authService.refreshTokens(command.userId);
    return {
      tokens: response,
    };
  }
}
