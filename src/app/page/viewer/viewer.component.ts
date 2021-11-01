import { AfterViewInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import WebViewer from "@pdftron/webviewer";
import { ToastrService } from "ngx-toastr";
import AppGlobal from "src/app/models/appGlobal.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { DocumentService } from "src/app/services/document.service";

@Component({
  selector: "app-viewer",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
})
export class ViewerComponent implements AfterViewInit {
  doc: DocumentVersionResponse;
  baseUrl = AppGlobal.getBaseUrl();
  constructor(
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService
  ) {}

  ngAfterViewInit(): void {
    const element = document.getElementById("viewer");
    const id: string = this.activatedRoute.snapshot.params.id;
    this.toaster.info("Loading...", "", { disableTimeOut: true });
    this.documentService.getDocument(id).subscribe((response) => {
      this.toaster.clear();
      if (response) {
        this.doc = response.result;
        WebViewer(
          {
            path: "/assets/public", // point to where the files you copied are served from
            initialDoc: `${AppGlobal.getBaseUrl()}${
              response.result.document.url
            }`, //
            fullAPI: true,
          },
          element
        );
      } else {
        this.toaster.error(response.message);
      }
    });
  }
}
