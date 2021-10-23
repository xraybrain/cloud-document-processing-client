import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/feedback.model';
import { UserAuthRequest } from '../models/user.model';
import { AuthService } from './auth.service';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/user/';

  constructor(private coreService: CoreService, private authService: AuthService) { }

  login(request: UserAuthRequest) {
    return this.coreService.postData<Feedback<boolean>>(request, `${this.apiUrl}login/`);
  }

  logOut() {
    return this.coreService.postData<Feedback<boolean>>(null, `${this.apiUrl}logout/`);
  }
}
