import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../infrastructure/auth/strategies/jwt-refresh.strategy';
import { AuthService } from '../../domain/services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../infrastructure/database/schemas/user.schema';
import { MongooseUserRepository } from '../../infrastructure/repositories/mongoose/user.repository';
import { AuthController } from '../../interfaces/controllers/auth.controller';
import { RegisterHandler } from '../commands/handlers/register.handler';
import { SendWelcomeEmailHandler } from '../commands/handlers/send-welcome-email.handler';
import { UserRegisteredHandler } from '../events/handlers/user-registered.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from '../../domain/services/user.service';
import { AuthSagas } from '../sagas/auth.sagas';
import { LoginHandler } from '../commands/handlers/login.handler';
import { RefreshTokenHandler } from '../commands/handlers/refresh-token.handler';

export const CommandHandlers = [
  RegisterHandler,
  LoginHandler,
  RefreshTokenHandler,
  SendWelcomeEmailHandler,
];

export const EventHandlers = [UserRegisteredHandler];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepository,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService,
    UserService,
    ...CommandHandlers,
    ...EventHandlers,
    AuthSagas,
  ],
})
export class AuthModule {}
