import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Feedback from "../models/feedback.model";
import {
  ResetPasswordRequest,
  User,
  UserAuthRequest,
} from "../models/user.model";
import { AuthService } from "./auth.service";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "/user/";

  constructor(private coreService: CoreService) {}
  login(request: UserAuthRequest) {
    return this.coreService.postData<Feedback<boolean>>(
      request,
      `${this.apiUrl}login/`
    );
  }

  createAccount(request: User) {
    return this.coreService.postData<Feedback<boolean>>(request, `/user/`);
  }

  editAccount(request: User) {
    return this.coreService.putData<Feedback<boolean>>(request, `/user/`);
  }

  chagePassword(request: ResetPasswordRequest) {
    return this.coreService.putData<Feedback<boolean>>(
      request,
      `/user/change/password`
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("upload", file);
    return this.coreService.uploadData<Feedback<string>>(
      formData,
      `/user/avatar`
    );
  }

  logOut() {
    return this.coreService.postData<Feedback<boolean>>(
      null,
      `${this.apiUrl}logout/`
    );
  }

  getProfile() {
    return this.coreService.getData<User>(`${this.apiUrl}profile/`);
  }

  getUsers(
    page = 1,
    search?: string,
    userId?: number
  ): Observable<Feedback<User>> {
    return this.coreService.getData(
      `/users?page=${page}&search=${search}&userid=${userId}`
    );
  }
}
