import { Component, OnDestroy } from '@angular/core';
import { ProductlayerComponent } from '../Done/productlayer/productlayer.component';
import { NgFor,NgIf } from '@angular/common';
import { HostListener,OnInit,inject} from '@angular/core';
import { ActivatedRoute, Router,RouterOutlet } from '@angular/router';
import { SearchService } from '../shared/search.service';
import { PriceService } from '../shared/price.service';
import {Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AllproductsService } from '../shared/allproducts.service';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';
import { MycartService } from '../shared/mycart.service';



@Component({
  selector: 'app-productslist',
  imports: [ProductlayerComponent, NgFor,NgIf,RouterOutlet], // <-- Add RouterOutlet here
  templateUrl: './productslist.component.html',
  styleUrl: './productslist.component.css'
})
export class ProductslistComponent implements OnInit,OnDestroy {

  
  searchTerm: string = '';
  private sub!: Subscription;
  private priceSub!: Subscription;
  products: Product[]=[];
  currentpage=1;
  itemsperpage=9;
  priceRange = { min: 0, max: 250 };
  loginID: string='';
  displayProducts: Product[] = [];;
 
  

 constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService,private priceService: PriceService,private AllProductsService: AllproductsService,private MycartService: MycartService) {}
  

 
  
  


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID;
     this.MycartService.setUser(this.loginID);
    console.log('Admin loginID:', this.loginID);
    this.AllProductsService.loginID = this.loginID; // Set loginID in the service
     if (!this.loginID) {
      alert("You are not logged in,please log in to access our website")
      setTimeout(()=>{
      this.router.navigate(['/login']);
      },500
      )
      return; // stop here if loginID is missing
    }
    
    this.updateItemsPerPage();
    this.AllProductsService.loadAllproducts();
    this.AllProductsService.allProducts$.subscribe(products=>{
      this.products=products;
      this.products= this.products.filter(product=>{
        return product.isDeleted==false;
      })
      this.displayProducts = [...this.filteredProducts];
      
    });

    this.sub= this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });
    this.priceSub = this.priceService.priceRange$.subscribe(range => {
      this.priceRange = range;
      this.applyFilters(); 
    });
  }

  }


  ngOnDestroy() {
  if (this.sub) {
    this.sub.unsubscribe();
  }
  if (this.priceSub) {
    this.priceSub.unsubscribe();
}
  }

private platformId = inject(PLATFORM_ID);
  @HostListener('window:resize')
  onResize() {
    this.updateItemsPerPage();
  }

  updateItemsPerPage() {
   let width=0;
   if (isPlatformBrowser(this.platformId)) {
     width = window.innerWidth;
   }
   
   
    if (width <= 576) {
      this.itemsperpage = 6;
    } else {
      this.itemsperpage = 9;
    }
  }

get filteredProducts() {
  return this.products.filter(product =>
    product.name.toLowerCase().includes(this.searchTerm.toLowerCase())&&
    product.amount >= this.priceRange.min &&
    product.amount <= this.priceRange.max
  );
}



get PaginatedProducts(){
  const start= (this.currentpage-1) * this.itemsperpage;
  return this.displayProducts.slice(start,start+ this.itemsperpage );
}

get totalPages(){
  return Math.ceil(this.filteredProducts.length / this.itemsperpage);
}

changePage(page: number) {
  this.currentpage = page;
  window.scrollTo(0, 0); 
}


getMin(a: number, b: number): number {
  return Math.min(a, b);
}

displayOptions=false;
currentOption="Most Popular";

applyFilters() {
  this.displayProducts = this.filteredProducts; 
  this.sortProducts(this.currentOption);        
  this.currentpage = 1;                          
}


showOptions(){
  this.displayOptions=!this.displayOptions;
}

sortProducts(criteria:string){
  this.displayOptions=false;
  this.currentOption=criteria;
  if(criteria==="Most Popular"){
    this.displayProducts = [...this.filteredProducts];
}

else if(criteria==="Price: Low to High"){
  this.displayProducts.sort((a,b)=>a.amount-b.amount);
}
else if(criteria==="Price: High to Low"){
  this.displayProducts.sort((a,b)=>b.amount-a.amount);
}
}

openPopup() {
  this.router.navigate(['/products', { outlets: { popup: ['filter'] } }]);
}



getPagesToShow(): number[] {
  const total = this.totalPages;
  const current = this.currentpage;

  let start = Math.max(current - 1, 1);   // show one before
  let end = Math.min(start + 2, total);   // only 3 total

  // adjust start if near the end
  start = Math.max(end - 2, 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}


}
