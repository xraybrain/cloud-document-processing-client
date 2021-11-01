import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { MustMatch } from "src/app/helpers/validators";
import { ResetPasswordRequest } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-change-password-modal",
  templateUrl: "./change-password-modal.component.html",
  styleUrls: ["./change-password-modal.component.css"],
})
export class ChangePasswordModalComponent implements OnInit {
  formData: FormGroup;
  constructor(
    private modal: NgbActiveModal,
    private toaster: ToastrService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formData = this.formBuilder.group(
      {
        password: new FormControl("", Validators.required),
        confirmPassword: new FormControl("", Validators.required),
      },
      { validator: MustMatch("password", "confirmPassword") }
    );
  }

  onSave() {
    const request = new ResetPasswordRequest();
    request.password = this.formData.value.password;
    request.confirmPassword = this.formData.value.confirmPassword;
    this.toaster.info("Processing...", "", { disableTimeOut: true });
    this.userService.chagePassword(request).subscribe((response) => {
      this.toaster.clear();
      if (response.success) {
        this.toaster.success("Password updated!");
        this.close();
      } else {
        this.toaster.error(response.message);
      }
    });
  }

  close() {
    this.modal.close();
  }
}
