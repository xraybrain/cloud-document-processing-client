import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProgressService {
  private progressSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor() {}

  progress(p: number) {
    return this.progressSubject.next(p);
  }

  observeProgress() {
    return this.progressSubject.asObservable();
  }
}
