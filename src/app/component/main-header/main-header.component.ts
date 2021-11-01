import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { DashboardView } from "src/app/models/dashboard.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";
import { ProgressService } from "src/app/services/progress.service";
import { NewFolderModalComponent } from "../new-folder-modal/new-folder-modal.component";

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.css"],
})
export class MainHeaderComponent implements OnInit {
  @Input()
  public currentFolder: number;

  @Input()
  public selectedDocuments: number[];

  @Input()
  public openFolders: DocumentVersionResponse[] = [];

  @Input()
  public isHome: boolean;

  @Output()
  public folderCreated: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  public gotoFolder: EventEmitter<DocumentVersionResponse> = new EventEmitter();

  @Output()
  public uploaded: EventEmitter<boolean> = new EventEmitter();

  selectedFiles: File[] = [];
  progressInfos: any[] = [];
  progress = 0;

  constructor(
    private modal: NgbModal,
    private documentService: DocumentService,
    private toaster: ToastrService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.progressService.observeProgress().subscribe((percent) => {
      this.progress = percent;
      if (percent === 100) {
        this.progress = 0;
      }
    });
  }

  onNewFolder() {
    if (this.isHome || (!this.isHome && this.currentFolder)) {
      const modalInstance = this.modal.open(NewFolderModalComponent, {
        size: "md",
        backdrop: "static",
      });
      modalInstance.componentInstance.folder = this.currentFolder;
      modalInstance.result.then((document) => {
        if (document) {
          this.folderCreated.emit(document);
        }
      });
    } else {
      this.toaster.error("Select a folder");
    }
  }

  onGotoFolder(doc: DocumentVersionResponse) {
    this.gotoFolder.emit(doc);
  }

  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
    this.progressInfos = [];
    this.initUpload();
  }

  initUpload() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.uploadFile(i, this.selectedFiles[i]);
    }
  }

  uploadFile(i: number, file: File) {
    this.documentService.uploadDocument(file).subscribe(
      (response) => {
        if (response.success) {
          this.toaster.success("Uploaded ");
          this.uploaded.emit(true);
          this.progress = 0;
        } else {
          this.toaster.error(response.message, "", { enableHtml: true });
        }
      },
      (err) => {
        this.progressInfos[i].value = 0;
        this.toaster.warning("Could not upload ${filename}", "", {
          timeOut: 5000,
        });
      }
    );
  }
}
