import { User } from "./user.model";

export class DocumentResponse {
  constructor(
    public userId: number,
    public mimeType: string,
    public extension: string,
    public url: string,
    public isFolder: boolean,
    public id?: number
  ) {}
}

export class DocumentVersionResponse {
  public document: DocumentResponse;
  public user: User;
  public folders: any[];
  public hide = false;
  public link: string;
  public members: User[] = [];
  constructor(
    public documentId: number,
    public userId: number,
    public name: string,
    public size: number,
    public isCurrent: boolean,
    public isStarred: boolean,
    public folderId: number,
    public id?: string
  ) {}
}

export class SelectedDocument {
  constructor(public doc: DocumentVersionResponse, public selected: boolean) {}
}

export class NewFolderRequest {
  constructor(public name: string, public folderId?: number) {}
}

export class TargetDocument {
  constructor(public name: string, public id?: number) {}
}

export class SelectedFolder {
  constructor(public doc: DocumentVersionResponse, parent: number) {}
}

export class CopyDocumentRequest {
  public folderId: number;
  public docsId: string[] = [];
  constructor() {}
}

export class MoveDocumentRequest {
  public folderId: number;
  public docsId: string[] = [];
  constructor() {}
}

export class RenameDocumentRequest {
  public id: string;
  public name: string;
}

export class StarDocumentRequest {
  public docId: string;
  public star: boolean;
}

export class DocumentViewRequest {
  page: number;
  isFolder: boolean;
  star: boolean;
  folderId: number;
  constructor() {}
}
