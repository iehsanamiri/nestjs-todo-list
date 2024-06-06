export class LoginUserDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
