import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  CommentItem,
  CommentRequest,
  ViewCommentRequest,
} from "src/app/models/comment.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { CommentService } from "src/app/services/comment.service";

@Component({
  selector: "app-comment-modal",
  templateUrl: "./comment-modal.component.html",
  styleUrls: ["./comment-modal.component.css"],
})
export class CommentModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse;

  currentPage = 1;
  hasMore: boolean;
  comments: CommentItem[] = [];

  formData: FormGroup;
  processing = false;

  constructor(
    private modal: NgbActiveModal,
    private commentService: CommentService,
    private toaster: ToastrService
  ) {}

  refreshForm() {
    this.formData = new FormGroup({
      content: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadComments();
    this.refreshForm();
  }

  loadComments() {
    const request = new ViewCommentRequest();
    request.docId = this.doc.documentId;
    request.page = this.currentPage;
    this.toaster.info("Loading Comments...", "", { disableTimeOut: true });

    this.commentService.getComments(request).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.comments = this.comments.concat(response.results);
        this.hasMore = response.pages > response.page;
        this.scrollToBottom();
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  loadMore() {
    if (!this.hasMore) {
      return;
    }
    ++this.currentPage;
    this.loadComments();
  }

  close() {
    this.modal.close(null);
  }

  scrollToBottom() {
    setTimeout(() => {
      $(".modal").scrollTop(100000000);
    }, 100);
  }

  comment() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    this.toaster.info("Commenting...", "", { disableTimeOut: true });
    const request = new CommentRequest();
    request.docId = this.doc.documentId;
    request.content = this.formData.value.content;
    this.commentService.comment(request).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.comments.push(response.result);
        this.refreshForm();
        this.scrollToBottom();
      } else {
        this.toaster.error(response.message, "", { timeOut: 2000 });
      }
    });
  }

  onDelete(comment: CommentItem) {
    const index = this.comments.findIndex((d) => d.id === comment.id);
    if (index !== -1) {
      this.comments.splice(index, 1);
    }
  }
}
