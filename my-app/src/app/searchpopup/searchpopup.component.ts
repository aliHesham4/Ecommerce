import { Component } from '@angular/core';
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

}
