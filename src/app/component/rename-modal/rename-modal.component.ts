import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  DocumentVersionResponse,
  RenameDocumentRequest,
} from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";

@Component({
  selector: "app-rename-modal",
  templateUrl: "./rename-modal.component.html",
  styleUrls: ["./rename-modal.component.css"],
})
export class RenameModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse;

  formData: FormGroup;
  processing = false;
  constructor(
    private documentService: DocumentService,
    private toaster: ToastrService,
    private modal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.formData = new FormGroup({
      name: new FormControl(this.doc.name, [Validators.required]),
    });
  }

  close() {
    this.modal.close();
  }

  renameDocument() {
    if (this.processing) {
      return;
    }
    const request = new RenameDocumentRequest();
    request.name = this.formData.value.name;
    request.id = this.doc.id;
    this.toaster.info("Renaming...", "", { disableTimeOut: true });
    this.documentService.renameDocument(request).subscribe((response) => {
      this.toaster.clear();
      this.processing = false;
      if (response.success) {
        this.toaster.success("Renamed", "", { timeOut: 2000 });
        this.doc.name = request.name;
        this.modal.close(this.doc);
      } else {
        this.toaster.error(response.message, "", { timeOut: 3000 });
      }
    });
  }
}
