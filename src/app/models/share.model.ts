import { DocumentVersionResponse } from "./document.model";
import { User } from "./user.model";

export class ShareDocumentResponse {
  public id: number;
  public version: DocumentVersionResponse;
  public versionId: number;
  public user: User;
  public userId: number;
}

export class ShareDocumentRequest {
  public docId: string;
  public user: number;
}

export class DeleteShareRequest {
  public docId: string;
  public user: number;
}
