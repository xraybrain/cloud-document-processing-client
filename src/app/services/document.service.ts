import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CopyDocumentRequest,
  DocumentVersionResponse,
  DocumentViewRequest,
  MoveDocumentRequest,
  NewFolderRequest,
  RenameDocumentRequest,
  StarDocumentRequest,
} from "../models/document.model";
import Feedback from "../models/feedback.model";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor(private coreService: CoreService) {}

  getDocuments(request: DocumentViewRequest) {
    return this.coreService.getData<Feedback<DocumentVersionResponse>>(
      // tslint:disable-next-line: max-line-length
      `/documents?page=${request.page}&folder=${request.folderId}&isfolder=${request.isFolder}&star=${request.star}&search=${request.search}`
    );
  }

  getDocument(id: string) {
    return this.coreService.getData<Feedback<DocumentVersionResponse>>(
      `/document?id=${id}`
    );
  }

  createFolder(request: NewFolderRequest) {
    return this.coreService.postData<Feedback<DocumentVersionResponse>>(
      request,
      `/document/folder`
    );
  }

  moveDocument(request: MoveDocumentRequest) {
    return this.coreService.postData<Feedback<boolean>>(
      request,
      "/documents/move/"
    );
  }

  copyDocument(request: CopyDocumentRequest) {
    return this.coreService.postData<Feedback<boolean>>(
      request,
      "/documents/copy/"
    );
  }

  renameDocument(request: RenameDocumentRequest) {
    return this.coreService.postData<Feedback<boolean>>(
      request,
      "/document/rename/"
    );
  }

  deleteDocument(ids: string[]) {
    return this.coreService.deleteData<Feedback<boolean>>(
      { ids },
      "/documents/"
    );
  }

  starDocument(request: StarDocumentRequest) {
    return this.coreService.postData<Feedback<boolean>>(
      request,
      "/document/star/"
    );
  }

  uploadDocument(files: File, folder: number) {
    const formData = new FormData();
    formData.append("upload", files);
    formData.append("folder", `${folder}`);

    return this.coreService.uploadData<Feedback<boolean>>(
      formData,
      "/document/upload/"
    );
  }
}
