import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContactComponent } from "./page/contact/contact.component";
import { DashboardComponent } from "./page/dashboard/dashboard.component";
import { HomeComponent } from "./page/home/home.component";
import { LoginComponent } from "./page/login/login.component";
import { ProfileComponent } from "./page/profile/profile.component";
import { SignupComponent } from "./page/signup/signup.component";
import { ViewerComponent } from "./page/viewer/viewer.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "dashboard/:view", component: DashboardComponent },
  { path: "preview/:id", component: ViewerComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "contact", component: ContactComponent },
  { path: "profile", component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
