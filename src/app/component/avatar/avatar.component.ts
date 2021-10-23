import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  private processing = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toaster: ToastrService) { }

  ngOnInit() {
  }

  onLogOut() {
    if (this.processing) { return; }
    this.processing = true;
    this.toaster.info('Logging out...', '', { disableTimeOut: true });
    this.userService.logOut().subscribe((feedback) => {
      this.toaster.clear();
      this.processing = false;
      if (feedback.success) {
        this.toaster.success('Success', '', { timeOut: 2000 });
        this.authService.clearAccessToken();
        location.href = '/';
      } else {
        this.toaster.error(feedback.message, '', { timeOut: 2000 });
      }
    });
  }

}
