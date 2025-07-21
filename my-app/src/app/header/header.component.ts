import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
  selector: 'app-header',
  imports: [CommonModule, SearchbarComponent,NavbarComponent],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  showColumn = true;

  hideColumn() {
    this.showColumn = false;
  }

  handleSearch(value: string) {
  console.log('Search value from child:', value);
}


}
