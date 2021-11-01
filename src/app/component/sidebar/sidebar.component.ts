import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DashboardView } from "src/app/models/dashboard.model";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  @Input()
  activeLink: DashboardView;
  view = DashboardView;

  @Output()
  selected: EventEmitter<DashboardView> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    $(".overlay").on("click", () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    $(".static-sidebar").toggleClass("open");
    $(".overlay").toggleClass("open");
  }

  onSelect(view: DashboardView) {
    this.selected.emit(view);
    this.activeLink = view;
    this.toggleSidebar();
  }
}
