import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchInput: string  = "";
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSearch(): void {
    this.search.emit(this.searchInput);
    const navigationExtras: NavigationExtras = {state: {searchInput: this.searchInput}};
    this.router.navigate(['/search'], navigationExtras)
    this.searchInput = "";
  }

}
