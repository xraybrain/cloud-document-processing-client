import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentVersionResponse } from "../models/document.model";
import Feedback from "../models/feedback.model";
import {
  DeleteShareRequest,
  ShareDocumentRequest,
  ShareDocumentResponse,
} from "../models/share.model";
import { User } from "../models/user.model";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class ShareService {
  constructor(private coreService: CoreService) {}

  getSharedDocuments(page = 1): Observable<Feedback<DocumentVersionResponse>> {
    return this.coreService.getData(`/shared/documents?page=${page}`);
  }

  getSharedWithMembers(docId: string): Observable<Feedback<User>> {
    return this.coreService.getData(`/shared/members?doc=${docId}`);
  }

  shareDocument(request: ShareDocumentRequest): Observable<Feedback<boolean>> {
    return this.coreService.postData(request, "/share/document/");
  }

  generateShareLink(docId: string): Observable<Feedback<string>> {
    return this.coreService.postData({ docId }, "/share/generate/link/");
  }

  deleteShare(request: DeleteShareRequest): Observable<Feedback<boolean>> {
    return this.coreService.deleteData(request, "/shared/document/");
  }
}
