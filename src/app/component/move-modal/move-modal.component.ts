import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { DocIconMap } from "src/app/models/docIconMap.model";
import {
  DocumentVersionResponse,
  MoveDocumentRequest,
  TargetDocument,
} from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";

@Component({
  selector: "app-move-modal",
  templateUrl: "./move-modal.component.html",
  styleUrls: ["./move-modal.component.css"],
})
export class MoveModalComponent implements OnInit {
  currentFolder: number;

  @Input()
  openFolders: DocumentVersionResponse[] = [];

  @Input()
  selectedItems: DocumentVersionResponse[] = [];

  docMap = DocIconMap;

  targetList: TargetDocument[];

  target: DocumentVersionResponse;

  processing = false;

  refreshSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  closeFolder: BehaviorSubject<DocumentVersionResponse> =
    new BehaviorSubject<DocumentVersionResponse>(null);

  constructor(
    private toaster: ToastrService,
    private modalInstance: NgbActiveModal,
    private modal: NgbModal,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.resetTargetList();
  }

  resetTargetList() {
    this.targetList = [new TargetDocument("CDMS", null)];
  }

  onChangeTarget(doc: DocumentVersionResponse) {
    if (doc) {
      if (doc.folderId == null) {
        this.resetTargetList();
      }
      const exists = this.targetList.find(
        (d) =>
          d.id === doc.documentId || (d.doc && d.doc.folderId === doc.folderId)
      );

      // targetList already has a doc with same parent folder
      const sameParent = this.targetList.find(
        (d) => d.doc && d.doc.folderId === doc.folderId
      );

      if (!exists) {
        this.targetList.push(new TargetDocument(doc.name, doc.documentId, doc));
      } else {
        let activeDoc: DocumentVersionResponse = doc;
        const index = this.targetList.findIndex(
          (d) =>
            d.id === doc.documentId ||
            (d.doc && d.doc.folderId === doc.folderId)
        );

        if (sameParent && index !== -1) {
          // remove and get the removed doc
          activeDoc = this.targetList.splice(index)[0].doc;
          // insert new doc
          this.targetList.push(
            new TargetDocument(doc.name, doc.documentId, doc)
          );
        } else if (index !== -1) {
          // not same parents but already exists remove
          this.targetList.splice(index + 1);
        } else {
          // do nothing
        }
        // broadcast event to close this activeDoc
        this.closeFolder.next(activeDoc);
      }
    } else {
      this.resetTargetList();
      this.refreshSubject.next(true);
    }

    this.target = doc;
  }

  moveDocuments() {
    if (this.processing) {
      return;
    }
    const request = new MoveDocumentRequest();
    request.folderId = this.target ? this.target.documentId : null;
    request.docsId = this.selectedItems.map((d) => d.id);
    this.processing = true;
    this.toaster.info("Moving...", "", { disableTimeOut: true });
    this.documentService.moveDocument(request).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.toaster.success("Moved", "", { timeOut: 2000 });
        this.modalInstance.close(this.target);
      } else {
        this.toaster.error(response.message, "", { timeOut: 3000 });
      }
    });
  }

  close() {
    this.modalInstance.close(null);
  }
}
