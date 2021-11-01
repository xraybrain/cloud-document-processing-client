import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MustMatch } from "src/app/helpers/validators";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  formData: FormGroup;
  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formData = this.formBuilder.group(
      {
        lastname: new FormControl("", Validators.required),
        firstname: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", Validators.required),
        confirmPassword: new FormControl("", [Validators.required]),
      },
      { validator: MustMatch("password", "confirmPassword") }
    );

    console.log(this.formData);
  }

  get f() {
    return this.formData.controls;
  }

  onCreateAccount() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    const request = new User();
    request.email = this.formData.value.email;
    request.firstname = this.formData.value.firstname;
    request.lastname = this.formData.value.lastname;
    request.password = this.formData.value.password;

    this.toaster.info("Creating Account...", "", { disableTimeOut: true });
    this.userService.createAccount(request).subscribe((response) => {
      this.toaster.clear();
      this.isProcessing = false;
      if (response.success) {
        this.toaster.success("Created!");
        this.router.navigate(["/login"]);
      } else {
        this.toaster.error(response.message);
      }
    });
  }
}
