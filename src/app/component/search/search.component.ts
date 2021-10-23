import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  active = false;
  constructor() { }

  onSearch() {
    this.active = true;
    $('body').css('overflow', 'hidden');
  }

  onClose() {
    this.active = false;
    $('body').css('overflow', 'scroll');
  }

  ngOnInit() {
  }

}
