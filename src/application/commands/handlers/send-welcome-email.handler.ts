import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendWelcomeEmailCommand } from '../send-welcome-email.command';
import { UserService } from '../../../domain/services/user.service';

@CommandHandler(SendWelcomeEmailCommand)
export class SendWelcomeEmailHandler
  implements ICommandHandler<SendWelcomeEmailCommand>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: SendWelcomeEmailCommand): Promise<void> {
    const { userId } = command;
    console.log(`Sending welcome email to user with id ${userId}`);
    const user = await this.userService.findById(userId);
    console.log(
      `Sent welcome email to user: ${user.username} with id ${userId}`,
    );
    // Logic to send email
  }
}
