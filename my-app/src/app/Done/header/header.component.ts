import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { Router, ActivatedRoute,RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';





@Component({
  selector: 'app-header',
  imports: [CommonModule, SearchbarComponent,RouterLink,RouterModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  ngOnInit(){
    this.currentRoute = this.router.url;
  }
  currentRoute: string='';

   constructor(private router: Router, private route: ActivatedRoute) {
     this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
   }

   openPopup() {
  this.router.navigate(['/products', { outlets: { popup: ['search'] } }]);
}

get isPopupSearch(): boolean {
  return this.router.url.includes('(popup:search)');
}

  showColumn = true;

  hideColumn() {
    this.showColumn = false;
  }

  handleSearch(value: string) {
  console.log('Search value from child:', value);
}

isOnProductList(){
  return this.currentRoute==="/products";
}

isOnCart(){
  return this.currentRoute==="/products/cart";
}



}
