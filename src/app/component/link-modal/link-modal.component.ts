import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import AppGlobal from "src/app/models/appGlobal.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { ShareService } from "src/app/services/share.service";

@Component({
  selector: "app-link-modal",
  templateUrl: "./link-modal.component.html",
  styleUrls: ["./link-modal.component.css"],
})
export class LinkModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse;

  processing = false;
  appGlobal = AppGlobal;

  constructor(
    private modal: NgbActiveModal,
    private shareService: ShareService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.generateLink();
  }

  close() {
    this.modal.close();
  }

  onCopy() {
    this.toaster.info("Copied");
  }

  generateLink() {
    if (this.processing) {
      return;
    }
    if (!this.doc.link) {
      this.toaster.info("Generating Link...", "", { disableTimeOut: true });
      this.processing = true;
      this.shareService.generateShareLink(this.doc.id).subscribe((response) => {
        this.toaster.clear();
        this.processing = false;
        if (response.success) {
          this.doc.link = response.result;
          this.toaster.success("Generated!");
        } else {
          this.toaster.error(response.message);
        }
      });
    }
  }
}
