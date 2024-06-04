import { Injectable } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserCreatedEvent } from '../../application/events/user-created.event';
import { SendWelcomeEmailCommand } from '../../application/commands/send-welcome-email.command';

@Injectable()
export class UserSagas {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      delay(1000),
      map((event) => {
        console.log('Inside [User] Saga');
        if (event instanceof UserCreatedEvent) {
          const { userId } = event;
          return new SendWelcomeEmailCommand(userId);
        }
      }),
    );
  };
}
