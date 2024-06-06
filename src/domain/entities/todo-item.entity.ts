export class TodoItem {
  constructor(
    public readonly id: string,
    public readonly todoList: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: number,
  ) {}
}
