export class CreateTodoItemCommand {
  constructor(
    public readonly todoListId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}