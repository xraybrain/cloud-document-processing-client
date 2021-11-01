import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { DocIconMap } from "src/app/models/docIconMap.model";
import {
  CopyDocumentRequest,
  DocumentVersionResponse,
  TargetDocument,
} from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";
import { NewFolderModalComponent } from "../new-folder-modal/new-folder-modal.component";

@Component({
  selector: "app-copy-modal",
  templateUrl: "./copy-modal.component.html",
  styleUrls: ["./copy-modal.component.css"],
})
export class CopyModalComponent implements OnInit {
  @Input()
  currentFolder: number;

  @Input()
  openFolders: DocumentVersionResponse[] = [];

  @Input()
  selectedItems: DocumentVersionResponse[] = [];

  docMap = DocIconMap;

  targetList: TargetDocument[];

  target: DocumentVersionResponse;

  processing = false;

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
    this.targetList = [new TargetDocument("Cloudify", null)];
    // this.target = this.targetList[0].id;
  }

  onChangeTarget(doc: DocumentVersionResponse) {
    if (doc.folderId == null) {
      this.resetTargetList();
    }
    const exists = this.targetList.find((d) => d.id === doc.documentId);

    if (!exists) {
      this.targetList.push(new TargetDocument(doc.name, doc.documentId));
    } else {
      const index = this.targetList.findIndex((d) => d.id === doc.documentId);
      if (index !== -1) {
        this.targetList.splice(index + 1);
      }
    }

    this.target = doc;
  }

  copyDocuments() {
    if (this.processing) {
      return;
    }
    const request = new CopyDocumentRequest();
    request.folderId = this.target ? this.target.documentId : null;
    request.docsId = this.selectedItems.map((d) => d.id);
    this.processing = true;
    this.toaster.info("Copying...", "", { disableTimeOut: true });
    this.documentService.copyDocument(request).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.toaster.success("Copied", "", { timeOut: 2000 });
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
