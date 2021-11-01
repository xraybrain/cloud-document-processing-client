import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity, ActivityViewRequest } from "../models/activity.model";
import Feedback from "../models/feedback.model";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class ActivityService {
  constructor(private coreService: CoreService) {}

  getActivities(request: ActivityViewRequest): Observable<Feedback<Activity>> {
    return this.coreService.getData(
      `/document/activities?page=${request.page}&docid=${request.docId}`
    );
  }
}
