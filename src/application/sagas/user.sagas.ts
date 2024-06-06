import { Injectable } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { SendWelcomeEmailCommand } from '../commands/send-welcome-email.command';

@Injectable()
export class UserSagas {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      delay(1000),
      map((event) => {
        console.log('Inside [User] Saga');
        if (event instanceof UserRegisteredEvent) {
          const { userId } = event;
          return new SendWelcomeEmailCommand(userId);
        }
      }),
    );
  };
}
