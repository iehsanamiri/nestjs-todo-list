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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepository,
    },
    UserService,
    UserSagas,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class UserModule {}
