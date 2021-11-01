import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  CommentItem,
  CommentRequest,
  EditCommentRequest,
  ViewCommentRequest,
} from "../models/comment.model";
import Feedback from "../models/feedback.model";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private coreService: CoreService) {}

  comment(request: CommentRequest): Observable<Feedback<CommentItem>> {
    return this.coreService.postData(request, "/document/comment");
  }

  getComments(request: ViewCommentRequest): Observable<Feedback<CommentItem>> {
    return this.coreService.getData(
      `/document/comments/?page=${request.page}&docid=${request.docId}`
    );
  }

  editComment(request: EditCommentRequest): Observable<Feedback<boolean>> {
    return this.coreService.putData(request, "/document/comment");
  }

  deleteComment(id: number): Observable<Feedback<boolean>> {
    return this.coreService.deleteData({ id }, "/document/comment");
  }
}
