export class TodoItem {
  constructor(
    public readonly todoList: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: number,
  ) {}
}
