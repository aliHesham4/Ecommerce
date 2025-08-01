import { Component,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { SearchService } from '../shared/search.service';


@Component({
  selector: 'app-searchbar',
  imports: [CommonModule,FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  searchTerm= '';
  constructor(private searchService: SearchService) {}
  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

}
