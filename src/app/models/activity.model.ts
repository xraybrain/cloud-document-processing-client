export class Activity {
  constructor(
    public documentId: number,
    public userId: number,
    public content: string,
    public id?: number
  ) {}
}

export class ActivityViewRequest {
  public page: number;
  public docId: number;
  constructor() {}
}
