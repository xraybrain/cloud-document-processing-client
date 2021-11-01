import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from "rxjs/operators";
import AppGlobal from "src/app/models/appGlobal.model";
import { DocumentVersionResponse } from "src/app/models/document.model";
import {
  DeleteShareRequest,
  ShareDocumentRequest,
} from "src/app/models/share.model";
import { User } from "src/app/models/user.model";
import { ShareService } from "src/app/services/share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-share-modal",
  templateUrl: "./share-modal.component.html",
  styleUrls: ["./share-modal.component.css"],
})
export class ShareModalComponent implements OnInit {
  @Input()
  doc: DocumentVersionResponse;
  users: User[] = [];
  isLoading = false;
  isAddMember = false;
  changeSubject = new BehaviorSubject<string>("");
  baseUrl = AppGlobal.getBaseUrl();

  constructor(
    private modal: NgbActiveModal,
    private toaster: ToastrService,
    private shareService: ShareService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getMembers();
    this.changeSubject
      .asObservable()
      .pipe(
        filter((text: string) => text.length > 2),
        debounceTime(10),
        distinctUntilChanged(),
        switchMap((search: string) => {
          this.isLoading = true;
          return this.userService.getUsers(1, search, this.doc.document.userId);
        })
      )
      .subscribe((response) => {
        this.isLoading = false;
        if (response.success) {
          this.users = response.results;
        } else {
          this.toaster.error(response.message);
        }
      });
  }

  getMembers() {
    if (!this.doc.members || this.doc.members.length === 0) {
      this.toaster.info("Loading members...", "", { disableTimeOut: true });
      this.shareService
        .getSharedWithMembers(this.doc.id)
        .subscribe((response) => {
          this.toaster.clear();
          if (response.success) {
            this.doc.members = response.results;
            this.toaster.success("Loaded!");
          } else {
            this.toaster.error(response.message);
          }
        });
    }
  }

  addMember(user: User) {
    const request = new ShareDocumentRequest();
    request.user = user.id;
    request.docId = this.doc.id;
    this.toaster.info("Adding...", "", { disableTimeOut: true });
    this.shareService.shareDocument(request).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.toaster.success("Added!");
        this.doc.members.push(user);
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  removeMember(user: User) {
    const request = new DeleteShareRequest();
    request.user = user.id;
    request.docId = this.doc.id;
    this.toaster.info("Deleting...", "", { disableTimeOut: true });
    this.shareService.deleteShare(request).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.toaster.success("Removed!");
        const index = this.doc.members.findIndex((d) => d.id === user.id);
        if (index !== -1) {
          this.doc.members.splice(index, 1);
        }
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  onTextChange(search: string) {
    this.changeSubject.next(search);
  }

  toggleAddMember() {
    this.isAddMember = !this.isAddMember;
  }

  getFirstLetter(name: string) {
    return name ? name.substring(0, 1) : "";
  }

  close() {
    this.modal.close();
  }
}
