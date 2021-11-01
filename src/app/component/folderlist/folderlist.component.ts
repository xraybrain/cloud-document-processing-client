import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {
  DocumentVersionResponse,
  DocumentViewRequest,
} from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";

@Component({
  selector: "app-folderlist",
  templateUrl: "./folderlist.component.html",
  styleUrls: ["./folderlist.component.css"],
})
export class FolderlistComponent implements OnInit {
  @Input()
  currentFolder: number;

  @Input()
  selectedItems: DocumentVersionResponse[] = [];

  @Output()
  selectFolder: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  folders: DocumentVersionResponse[] = [];
  currentPage = 1;
  hasMore: boolean;

  currentSelected: DocumentVersionResponse;

  constructor(
    private toaster: ToastrService,
    private documentService: DocumentService
  ) {}

  loadFolders(folder?: DocumentVersionResponse) {
    this.toaster.info("Loading...", "", { disableTimeOut: true });
    let currentFolder = this.currentFolder;
    if (folder) {
      currentFolder = folder.document.id;
    }
    const request = new DocumentViewRequest();
    request.page = this.currentPage;
    request.folderId = currentFolder;
    request.isFolder = true;
    this.documentService.getDocuments(request).subscribe((feedback) => {
      this.toaster.clear();
      if (feedback.success) {
        if (folder) {
          folder.folders = feedback.results;
          folder.hide = false;
        } else {
          this.folders = feedback.results;
        }
        this.hasMore = feedback.pages > this.currentPage + 1;
      } else {
        this.toaster.warning(feedback.message, "", { timeOut: 2000 });
      }
    });
  }

  onSelectFolder(doc: DocumentVersionResponse) {
    const selected = this.selectedItems.find((d) => d.id === doc.id);
    if (
      this.currentSelected &&
      this.currentSelected.id !== doc.id &&
      doc.folderId == null
    ) {
      this.closeFolders(this.currentSelected);
    }
    if (doc.folderId == null) {
      this.currentSelected = doc;
    }

    if (selected) {
      this.toaster.warning("Select another target", "", { timeOut: 5000 });
    } else {
      this.selectFolder.emit(doc);
      doc.hide = !doc.hide;
      console.log(doc);
      if (!doc.folders) {
        this.loadFolders(doc);
      }
    }
  }

  closeFolders(folder: DocumentVersionResponse) {
    folder.hide = true;
    if (folder.folders) {
      for (const f of folder.folders) {
        this.closeFolders(f);
      }
    }
    return;
  }

  ngOnInit() {
    this.loadFolders();
  }
}
