import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ActivityModalComponent } from "src/app/component/activity-modal/activity-modal.component";
import { CommentModalComponent } from "src/app/component/comment-modal/comment-modal.component";
import { CopyModalComponent } from "src/app/component/copy-modal/copy-modal.component";
import { DeleteModalComponent } from "src/app/component/delete-modal/delete-modal.component";
import { LinkModalComponent } from "src/app/component/link-modal/link-modal.component";
import { MemberModalComponent } from "src/app/component/member-modal/member-modal.component";
import { MoveModalComponent } from "src/app/component/move-modal/move-modal.component";
import { RenameModalComponent } from "src/app/component/rename-modal/rename-modal.component";
import { ShareModalComponent } from "src/app/component/share-modal/share-modal.component";
import { DashboardView } from "src/app/models/dashboard.model";
import {
  DocumentVersionResponse,
  DocumentViewRequest,
  StarDocumentRequest,
} from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";
import { ShareService } from "src/app/services/share.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  documents: DocumentVersionResponse[] = [];
  currentFolder: number;
  currentPage = 1;
  star = false;
  hasMore: boolean;
  openFolders: DocumentVersionResponse[] = [];
  selectedItems: DocumentVersionResponse[] = [];
  processing: any;
  isHome: boolean;
  isShare: boolean;
  isStar: boolean;
  currentView: DashboardView;
  searchText: string;

  constructor(
    private documentService: DocumentService,
    private shareService: ShareService,
    private toaster: ToastrService,
    private modal: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const view = this.activatedRoute.snapshot.params.view || "home";
    this.onNavSelected(Number(DashboardView[view]));
  }

  setView(mode: DashboardView) {
    this.searchText = "";
    this.currentView = mode;
    this.isHome = mode === DashboardView.home;
    this.isShare = mode === DashboardView.share;
    this.isStar = mode === DashboardView.star;
  }

  onFolderCreated(doc: DocumentVersionResponse) {
    this.documents.unshift(doc);
  }

  onOpenFolder(doc: DocumentVersionResponse) {
    this.currentFolder = doc.document.id;
    this.documents = [];
    const alreadyOpen = this.openFolders.find((d) => d.id === doc.id);
    if (!alreadyOpen) {
      this.openFolders.push(doc);
    }
    this.loadDocuments();
  }

  onGotoFolder(doc?: DocumentVersionResponse) {
    this.searchText = "";
    if (doc !== null) {
      if (this.currentFolder === doc.document.id) {
        return;
      }

      this.currentFolder = doc.document.id;
      const index = this.openFolders.findIndex((d) => d.id === doc.id);
      if (index !== -1) {
        this.openFolders.splice(index + 1);
      }
    } else {
      this.openFolders = [];
      this.currentFolder = null;
    }
    this.documents = [];
    this.loadDocuments();
  }

  onSearch(search: string) {
    this.searchText = search;
    if (this.currentView === DashboardView.share) {
      this.loadSharedDocuments(true);
    } else {
      this.loadDocuments(true);
    }
  }

  loadDocuments(refresh = true) {
    if (refresh) {
      this.documents = [];
      this.currentPage = 1;
      this.hasMore = false;
    }
    this.toaster.info("Loading...", "", { disableTimeOut: true });
    const request = new DocumentViewRequest();
    request.page = this.currentPage;
    request.folderId = this.currentFolder;
    request.star = this.star;
    request.isFolder = false;
    request.search = this.searchText;

    this.documentService.getDocuments(request).subscribe((feedback) => {
      this.toaster.clear();
      if (feedback.success) {
        this.documents = this.documents.concat(feedback.results);
        this.hasMore = feedback.pages > feedback.page;
      } else {
        this.toaster.warning(feedback.message, "", { timeOut: 3000 });
      }
    });
  }

  loadSharedDocuments(refresh = true) {
    if (refresh) {
      this.documents = [];
      this.currentPage = 1;
      this.hasMore = false;
    }
    this.toaster.info("Loading...", "", { disableTimeOut: true });
    this.shareService
      .getSharedDocuments(this.currentPage)
      .subscribe((feedback) => {
        this.toaster.clear();
        if (feedback.success) {
          this.documents = this.documents.concat(feedback.results);
          this.hasMore = feedback.pages > feedback.page;
        } else {
          this.toaster.warning(feedback.message, "", { timeOut: 3000 });
        }
      });
  }

  loadMore() {
    ++this.currentPage;
    if (this.currentView === DashboardView.share) {
      this.loadSharedDocuments(false);
    } else {
      this.loadDocuments(false);
    }
  }

  onCopy(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(CopyModalComponent, {
      size: "lg",
      backdrop: "static",
    });

    // modalInstance.componentInstance.currentFolder = this.currentFolder;
    modalInstance.componentInstance.selectedItems = [doc];
    modalInstance.result.then((d: DocumentVersionResponse) => {
      if (d !== null) {
        this.onOpenFolder(d);
      }
    });
  }

  onMove(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(MoveModalComponent, {
      size: "lg",
      backdrop: "static",
    });

    // modalInstance.componentInstance.currentFolder = this.currentFolder;
    modalInstance.componentInstance.selectedItems = [doc];
    modalInstance.result.then((d: DocumentVersionResponse) => {
      if (d !== null) {
        this.onOpenFolder(d);
      }
    });
  }

  onStar(doc: DocumentVersionResponse) {
    if (this.processing) {
      return;
    }
    const request = new StarDocumentRequest();
    request.star = !doc.isStarred;
    request.docId = doc.id;
    this.processing = true;
    this.toaster.info("Processing...", "", { disableTimeOut: true });
    this.documentService.starDocument(request).subscribe((response) => {
      this.processing = false;
      this.toaster.clear();
      if (response.success) {
        doc.isStarred = request.star;
        this.toaster.success("Done!");
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  onRename(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(RenameModalComponent, {
      size: "md",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = JSON.parse(JSON.stringify(doc));
    modalInstance.result.then((update: DocumentVersionResponse) => {
      if (update) {
        const index = this.documents.findIndex((d) => d.id === update.id);

        if (index !== -1) {
          this.documents[index] = update;
        }
      }
    });
  }

  onComments(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(CommentModalComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = doc;
  }

  onActivities(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(ActivityModalComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = doc;
  }

  onMembers(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(MemberModalComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = doc;
  }

  onShare(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(ShareModalComponent, {
      size: "md",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = doc;
  }

  onGetLink(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(LinkModalComponent, {
      size: "md",
      backdrop: "static",
    });

    modalInstance.componentInstance.doc = doc;
  }

  onDelete(doc: DocumentVersionResponse) {
    const modalInstance = this.modal.open(DeleteModalComponent, {
      size: "md",
      backdrop: "static",
    });
    console.log(doc);
    modalInstance.componentInstance.doc = doc;
    modalInstance.result.then((version) => {
      if (version) {
        const index = this.documents.findIndex((d) => d.id === version.id);
        if (index !== -1) {
          this.documents.splice(index, 1);
        }
      }
    });
  }

  onUpload(status: boolean) {
    this.documents = [];
    if (status) {
      this.loadDocuments();
    }
  }

  onNavSelected(mode: DashboardView) {
    this.setView(mode);
    this.currentFolder = undefined;
    this.openFolders = [];
    switch (mode) {
      case DashboardView.home:
        this.star = false;
        this.loadDocuments(true);
        break;
      case DashboardView.star:
        this.star = true;
        this.loadDocuments(true);
        break;
      case DashboardView.share:
        this.loadSharedDocuments(true);
        break;
    }
  }
}
