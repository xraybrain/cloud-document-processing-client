import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Activity, ActivityViewRequest } from "src/app/models/activity.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import { ActivityService } from "src/app/services/activity.service";

@Component({
  selector: "app-activity-modal",
  templateUrl: "./activity-modal.component.html",
  styleUrls: ["./activity-modal.component.css"],
})
export class ActivityModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse;

  hasMore: boolean;
  currentPage = 1;
  activities: Activity[] = [];

  constructor(
    private toaster: ToastrService,
    private modal: NgbActiveModal,
    private activityService: ActivityService
  ) {}

  loadActivities() {
    const request = new ActivityViewRequest();
    request.docId = this.doc.documentId;
    request.page = this.currentPage;
    this.toaster.info("Loading...", "", { disableTimeOut: true });
    this.activityService.getActivities(request).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.activities = this.activities.concat(response.results);
        this.hasMore = response.pages > response.page;
      } else {
        this.toaster.error(response.message, "", { timeOut: 2000 });
      }
    });
  }

  loadMore() {
    ++this.currentPage;
    this.hasMore = false;
    this.loadActivities();
  }

  close() {
    this.modal.close(null);
  }

  ngOnInit() {
    this.loadActivities();
  }
}
