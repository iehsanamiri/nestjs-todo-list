import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/database/schemas/user.schema';
import { MongooseUserRepository } from './infrastructure/repositories/mongoose/user.repository';
import { User } from './domain/entities/user.entity';
import { UserController } from './interfaces/controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './domain/services/user.service';
import { CommandHandlers } from './application/commands/handlers';
import { EventHandlers } from './application/events/handlers';
import { QueryHandlers } from './application/queries/handlers';
import { UserSagas } from './infrastructure/sagas/user.sagas';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './application/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepository,
    },
    UserService,
    UserSagas,
    JwtStrategy,
    JwtRefreshStrategy,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class UserModule {}
