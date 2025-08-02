import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'app-searchpopup',
  imports: [SearchbarComponent],
  templateUrl: './searchpopup.component.html',
  styleUrl: './searchpopup.component.css'
})
export class SearchpopupComponent {
    constructor(private router: Router,private route: ActivatedRoute) {}

closePopup() {
  this.router.navigate(['/products',{ outlets: { popup: null } }]);
}

closePopupApply(){

 this.router.navigate(['/products',{ outlets: { popup: null } }]);

}

@ViewChild('searchbar') searchbar!: SearchbarComponent;
  onSearch() {
    this.searchbar.onSearch();
  }

}
