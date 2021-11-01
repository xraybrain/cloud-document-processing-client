import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";

@Component({
  selector: "app-delete-modal",
  templateUrl: "./delete-modal.component.html",
  styleUrls: ["./delete-modal.component.css"],
})
export class DeleteModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse | any = {};
  processing = false;

  constructor(
    private documentService: DocumentService,
    private modal: NgbActiveModal,
    private toaster: ToastrService
  ) {}

  onDelete() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    this.toaster.info("Deleting...", "", { disableTimeOut: true });
    this.documentService.deleteDocument([this.doc.id]).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.toaster.success("Deleted!");
        this.modal.close(this.doc);
      } else {
        this.toaster.error(response.message);
      }
    });
  }
  close() {
    this.modal.close(null);
  }
  ngOnInit() {}
}
