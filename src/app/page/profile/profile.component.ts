import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ChangePasswordModalComponent } from "src/app/component/change-password-modal/change-password-modal.component";
import AppGlobal from "src/app/models/appGlobal.model";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  formData: FormGroup;
  user: User;
  baseUrl = AppGlobal.getBaseUrl();

  constructor(
    private modal: NgbModal,
    private toaster: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.formData = new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
    });
    this.userService.getProfile().subscribe((response) => {
      if (response) {
        this.user = response;
        this.formData = new FormGroup({
          firstname: new FormControl(response.firstname, [Validators.required]),
          lastname: new FormControl(response.lastname, [Validators.required]),
          email: new FormControl(response.email, [Validators.required]),
        });
      } else {
        this.toaster.error("Failed to retrieve profile");
      }
    });
  }

  onSave() {
    this.toaster.info("Saving...", "", { disableTimeOut: true });
    const user = new User();
    user.firstname = this.formData.value.firstname;
    user.lastname = this.formData.value.lastname;
    user.email = this.formData.value.email;
    user.id = this.user.id;
    this.userService.editAccount(user).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.toaster.success("Updated!");
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  onChangeAvatar(selected: any) {
    const file = selected.target.files[0];
    if (file) {
      this.toaster.info("Uploading...", "", { disableTimeOut: true });
      this.userService.uploadAvatar(file).subscribe((response) => {
        this.toaster.clear();
        if (response.success) {
          this.toaster.success("Uploaded");
          this.user.image = response.result;
        } else {
          this.toaster.error(response.message);
        }
      });
    }
  }

  onChangePassword() {
    const modalInstance = this.modal.open(ChangePasswordModalComponent, {
      size: "md",
      backdrop: "static",
    });
  }
}
