import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import AppGlobal from "src/app/models/appGlobal.model";
import { DocIconMap } from "src/app/models/docIconMap.model";
import {
  DocumentVersionResponse,
  SelectedDocument,
} from "src/app/models/document.model";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.css"],
})
export class DocumentComponent implements OnInit {
  @Input()
  data: DocumentVersionResponse;

  @Output()
  selectionChange: EventEmitter<SelectedDocument> = new EventEmitter();

  @Output()
  openFolder: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  copyDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  moveDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  starDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  renameDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  deleteDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  shareDocument: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  comments: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  activities: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  members: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  link: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  selected = false;

  docIconMap = DocIconMap;
  baseUrl = AppGlobal.getBaseUrl();

  constructor() {}

  ngOnInit() {}

  toggleSelect() {
    this.selected = !this.selected;
    this.selectionChange.emit(new SelectedDocument(this.data, this.selected));
  }

  onOpenFolder() {
    this.openFolder.emit(this.data);
  }

  onCopy() {
    this.copyDocument.emit(this.data);
  }

  onMove() {
    this.moveDocument.emit(this.data);
  }

  onStar() {
    this.starDocument.emit(this.data);
  }

  onRename() {
    this.renameDocument.emit(this.data);
  }

  onDelete() {
    this.deleteDocument.emit(this.data);
  }

  onShare() {
    this.shareDocument.emit(this.data);
  }

  onComments() {
    this.comments.emit(this.data);
  }

  onActivities() {
    this.activities.emit(this.data);
  }

  onMembers() {
    this.members.emit(this.data);
  }

  onGetLink() {
    this.link.emit(this.data);
  }

  isImage() {
    return this.data.document.mimeType.indexOf("image") !== -1;
  }
}
