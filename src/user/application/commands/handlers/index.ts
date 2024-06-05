import { CreateUserHandler } from './create-user.handler';
import { SendWelcomeEmailHandler } from './send-welcome-email.handler';

export const CommandHandlers = [CreateUserHandler, SendWelcomeEmailHandler];
