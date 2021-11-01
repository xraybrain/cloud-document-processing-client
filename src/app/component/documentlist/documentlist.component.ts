import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DocIconMap } from "src/app/models/docIconMap.model";
import { DocumentVersionResponse } from "src/app/models/document.model";

@Component({
  selector: "app-documentlist",
  templateUrl: "./documentlist.component.html",
  styleUrls: ["./documentlist.component.css"],
})
export class DocumentlistComponent implements OnInit {
  @Input()
  documents = [];

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

  constructor() {}

  ngOnInit() {}

  // trigger open folder event
  onOpenFolder(doc: DocumentVersionResponse) {
    this.openFolder.emit(doc);
  }

  onCopy(doc: DocumentVersionResponse) {
    this.copyDocument.emit(doc);
  }

  onMove(doc: DocumentVersionResponse) {
    this.moveDocument.emit(doc);
  }

  onStar(doc: DocumentVersionResponse) {
    this.starDocument.emit(doc);
  }

  onRename(doc: DocumentVersionResponse) {
    this.renameDocument.emit(doc);
  }

  onShare(doc: DocumentVersionResponse) {
    this.shareDocument.emit(doc);
  }

  onComments(doc: DocumentVersionResponse) {
    this.comments.emit(doc);
  }

  onActivities(doc: DocumentVersionResponse) {
    this.activities.emit(doc);
  }

  onMembers(doc: DocumentVersionResponse) {
    this.members.emit(doc);
  }

  onGetLink(doc: DocumentVersionResponse) {
    this.link.emit(doc);
  }

  onDelete(doc: DocumentVersionResponse) {
    this.deleteDocument.emit(doc);
  }
}
