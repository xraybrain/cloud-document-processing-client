import { DocumentResponse } from "./document.model";
import { User } from "./user.model";

export class CommentItem {
  public user: User;
  public document: DocumentResponse;
  public isEditMode: boolean;
  constructor(
    public documentId: number,
    public userId: number,
    public content: string,
    public id?: number
  ) {}
}

export class CommentRequest {
  public docId: number;
  public content: string;
}

export class EditCommentRequest {
  public id: number;
  public content: string;
}

export class ViewCommentRequest {
  page: number;
  docId: number;
}
