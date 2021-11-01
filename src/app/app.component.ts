import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Cloudify";
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isLoggedIn = authService.isLoggedIn();
    console.log(this.activatedRoute.snapshot.params);
  }
}
