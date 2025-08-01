import { Component,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { SearchService } from '../shared/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-searchbar',
  imports: [CommonModule,FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  searchTerm= '';
  constructor(private searchService: SearchService, private router: Router) {}
  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  get isInPopupRoute(): boolean {
  return this.router.url.includes('(popup:search)');
}

}
