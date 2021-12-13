import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
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
  @Input()
  refreshSubject: Observable<boolean>;
  @Input()
  closeFolder: Observable<DocumentVersionResponse>;
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

    if (
      this.currentSelected &&
      this.currentSelected.folderId === doc.folderId
    ) {
      console.log("changed root");
      this.closeFolders(this.currentSelected);
    }

    if (selected) {
      this.toaster.warning("Select another target", "", { timeOut: 5000 });
    } else {
      if (!doc.folders) {
        this.loadFolders(doc);
      }
      if (this.currentSelected) {
        // sub folder
        if (doc.folderId === this.currentSelected.documentId) {
          console.log("sub folder");
          doc.folderTree = this.currentSelected.folderTree || [];
          doc.folderTree.push(this.currentSelected.documentId);
        }
      }
      this.currentSelected = doc;
      this.selectFolder.emit(doc);
      doc.hide = !doc.hide;
    }
    console.log(this.currentSelected);
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
    this.refreshSubject.subscribe((refresh) => {
      if (refresh) {
        this.loadFolders();
      }
    });
    this.closeFolder.subscribe((doc) => {
      if (doc) {
        this.closeFolders(doc);
      }
    });
  }
}
