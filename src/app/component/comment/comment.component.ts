import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import AppGlobal from "src/app/models/appGlobal.model";
import {
  CommentItem,
  CommentRequest,
  EditCommentRequest,
} from "src/app/models/comment.model";
import { CommentService } from "src/app/services/comment.service";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit {
  @Input()
  data: CommentItem;

  @Output()
  edit: EventEmitter<CommentItem> = new EventEmitter();

  @Output()
  delete: EventEmitter<CommentItem> = new EventEmitter();

  baseUrl = AppGlobal.getBaseUrl();

  formData: FormGroup;

  processing = false;

  constructor(
    private commentService: CommentService,
    private toaster: ToastrService
  ) {}

  onEdit(cancel = false) {
    this.data.isEditMode = cancel ? false : true;
    this.formData = new FormGroup({
      content: new FormControl(this.data.content, [Validators.required]),
    });
  }

  onDelete() {
    if (this.processing) {
      return;
    }
    this.processing = true;
    this.toaster.info("Updating...", "", { disableTimeOut: true });
    this.commentService.deleteComment(this.data.id).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.delete.emit(this.data);
        this.toaster.success("Deleted", "", { timeOut: 2000 });
      } else {
        this.toaster.error(response.message, "", { timeOut: 2000 });
      }
    });
  }

  onUpdate() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    const request = new EditCommentRequest();
    request.id = this.data.id;
    request.content = this.formData.value.content;
    this.toaster.info("Updating...", "", { disableTimeOut: true });
    this.commentService.editComment(request).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.toaster.success("Updated", "", { timeOut: 2000 });
        this.data.content = request.content;
        this.edit.emit(this.data);
        this.onEdit(true);
      } else {
        this.toaster.error(response.message, "", { timeOut: 2000 });
      }
    });
  }

  ngOnInit() {}
}
