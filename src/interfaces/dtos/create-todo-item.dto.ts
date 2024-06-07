export class CreateTodoItemDto {
  constructor(public readonly todoListId: string,
              public readonly title: string,
              public readonly description: string) {
  }
}