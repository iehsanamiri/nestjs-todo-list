export class CreateUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
