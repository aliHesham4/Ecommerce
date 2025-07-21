import { Component,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'


@Component({
  selector: 'app-searchbar',
  imports: [CommonModule,FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  onSearch() {
    this.search.emit(this.searchTerm);
  }

}
