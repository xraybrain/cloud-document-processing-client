import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { UserAuthRequest } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  formData: FormGroup;
  processing = false;

  constructor(
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  get f() {
    return this.formData.controls;
  }

  ngOnInit() {
    this.formData = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
    });
  }

  onLogin() {
    if (this.processing) {
      return;
    }
    const request = new UserAuthRequest();
    request.email = this.formData.value.email;
    request.password = this.formData.value.password;

    this.processing = true;
    this.toaster.info("Authenticating...", "", { disableTimeOut: true });
    this.userService.login(request).subscribe((response) => {
      this.processing = false;
      this.toaster.clear();
      if (response.success) {
        this.toaster.success(response.message, "", { timeOut: 2000 });
        location.href = "/dashboard";
      } else {
        this.toaster.error(response.message, "", { timeOut: 2000 });
      }
    });
  }
}
