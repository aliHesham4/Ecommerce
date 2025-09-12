import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {Router} from '@angular/router';
import { AllproductsService } from '../../shared/allproducts.service';
// for date picker
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CanActivate } from '@angular/router';



export interface Product{
  "id": string,
  "isDeleted": boolean,
  "createdOn": Date,
  "updatedOn": Date,
  "productImages": string[],
  "name": string,
  "description": string,
  "amount": number,
  "type": string,
  "stockQuantity": number,
  "status": string,
  "SKU"?: string,
  "VAT"?: number,
  "selected"?: boolean,
  "taxclass"?: string,
  "discounttype"?: string,
  "discountvalue"?: number,
  "images"?: string[],
  "length"?: number,
  "width"?: number,
  "height"?: number,
  "weight"?: number,
  "oldPrice"?: number,
  "isSelected"?:string
  "quantityTaken"?:number


}

@Component({
  selector: 'app-adminproductlist',
  imports: [ FormsModule, CommonModule,MatDatepickerModule,MatNativeDateModule,MatInputModule,MatFormFieldModule,RouterModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css'
})


export class AdminproductlistComponent implements CanActivate {
  selectAll: boolean = false;  // For "Select All" checkbox
  searchText: string = '';  // For search input
  loginID: string | null = null; // To store loginID from localStorage
  hasError: boolean = false;  // To track if there was an error fetching products then display no products avaible in webpage
  products: Product[] = []; // Array to hold products fetched from API
  showDeletePopup: boolean = false; // To control visibility of delete confirmation popup
  productIdToDelete: string | null = null; // To store the ID of the product to be deleted
  on: boolean = true;  // For sorting toggle
  onP: boolean = true; // For price sorting toggle
  onD: boolean = true; // For date sorting toggle
  pageNumber: number = 1; // Current page number for pagination
  stopNext: boolean=false; // To stop next button if there are no more products
  allProducts:Product[]=[]; // To hold all products for searching and filtering
  openpreview:boolean=false; // To control visibility of preview popup
  selectedProduct: any = null; // To hold the product being previewed
  itemsPerPage: number = 10; // Number of items to display per page
  filterSelected:boolean=false; // To check if filter is not selected and to show all products
  startDate: Date | null = null; // To hold the selected start date from date picker
  endDate: Date | null = null; // To hold the selected end date from date picker
  filterpopup:boolean=false; // To control visibility of filter popup
  topsSelected:boolean=true; // To check if top filter is selected
  bottomsSelected:boolean=true; // To check if bottom filter is selected
  shoesSelected:boolean=true; // To check if shoes filter is selected
  dressesSelected:boolean=true;
  accessoriesSelected:boolean=true; // To check if accessories filter is selected
  Math=Math;

  constructor(private http: HttpClient, private route: ActivatedRoute,@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private allProductsService: AllproductsService) {}

  

  ngOnInit(): void {
    // get loginID from local storage
    if (isPlatformBrowser(this.platformId)) {
    this.loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID;
    console.log('Admin loginID:', this.loginID);
    this.fetchProducts();
    this.allProductsService.loginID = this.loginID; // Set loginID in the service
    this.allProductsService.allProducts$.subscribe(allProducts => {
      this.allProducts = allProducts;
    });

    this.allProductsService.loadAllproducts(); // Load all products when component initializes
    }
   
  }

  canActivate(): boolean {
    const loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID; // ✅ check if logged in
    const isAdmin= JSON.parse(localStorage.getItem('loginID') || '{}').isAdmin;
    if (loginID && isAdmin) {
      return true; // allow access
    } else {
      alert("You must log in or be an admin to access this page.");
      this.router.navigate(['/login']); // redirect to login
      return false; // block access
    }
  }



 checkStopNext(): void {
  if(this.filterSelected){
  const maxPages = Math.ceil(this.products.length / 10);
  this.stopNext = this.pageNumber >= maxPages;
  }
}


  // select all checkbox

  toggleSelectAll(): void {
  this.products.forEach(product => product.selected = this.selectAll);
}

checkIfAllSelected(): void {
  this.selectAll = this.products.every(product => product.selected);
}


//  sorting
  sortProducts(): void {

   if (this.on){
    this.products.sort((a, b) => b.name.localeCompare(a.name));  //if ascending make descending
    this.onP=true;
    this.onD=true;
    
   }else
    this.products.sort((a,b)=> a.name.localeCompare(b.name));   // if descending make ascending
    this.on=!this.on
   
  }


  sortPrice():void{
    if (this.onP) {
      this.products.sort((a, b) => b.amount - a.amount);      // if ascending make descending
      this.on = true;
      this.onD=true;
    } else {
      this.products.sort((a, b) => a.amount - b.amount);     // if descending make ascending
    }
    this.onP = !this.onP;
  }

  sortDate(): void {
  if (this.onD) {
    this.products.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
  } else {
    this.products.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
  }
  this.on = true;
  this.onP = true;
  this.onD = !this.onD;
}


// pagination
  previousPage(): void {
     
      this.pageNumber--;
      if(!this.filterSelected)
      this.fetchProducts();
      this.stopNext = false;
    
  }
  nextPage(): void {
  
  if(!this.filterSelected){
  this.pageNumber++;
  this.http.get<{ data: Product[] }>(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=${this.pageNumber + 1}`)
    .subscribe({
      next: (response) => {
        if (response.data.length == 0) {
          this.stopNext = true;
        }
      }
    });
    this.fetchProducts();
     }else {
    const maxPages = Math.ceil(this.products.length / 10);

    if (this.pageNumber < maxPages) {
      this.pageNumber++;
    this.checkStopNext();
    }
   
  }
    }

  get PaginatedProducts(){
  const start= (this.pageNumber-1) * 10;
  return this.products.slice(start,start+ 10 );
}

  // delete product

  onDelete(productId: string): void {
    this.showDeletePopup = true;
    this.productIdToDelete = productId;
  }

  confirmDelete(): void {
    if (this.productIdToDelete) {
      this.http.delete(`https://localhost:7096/api/Product/deleteproduct/${this.productIdToDelete}`)
        .subscribe({
          next: () => {
            this.showDeletePopup = false;
            this.fetchProducts();

          },
          error: (err) => {
            console.error('Error deleting product:', err);
          }
        });
    }
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.productIdToDelete = null;

  }

  // preview popup

  openPreviewPopup(product: Product):void{
    this.selectedProduct = product;
    this.openpreview=true;
  }

  closePreviewPopup():void{
    this.openpreview=false;
    this.selectedProduct = null;
  }

  // fetch products from API

  fetchProducts():void{
    if (this.loginID) {
      this.http.get<{ data: Product[] }>(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=${this.pageNumber}`)
        .subscribe({
          next: (response) => {
            this.products = response.data.map(product=>{
              const key=`product-${product.id}`;
              const localData= localStorage.getItem(key);
              if(localData){
                const parsed=JSON.parse(localData);
                const oldPrice = parsed.discountpercentage != 0 
                 ? Math.round(((parsed.discountpercentage + 100) / 100) * product.amount)
                 : null;
                return {
                  ...product,
                  discounttype: parsed.discounttype,
                  SKU: parsed.sku,
                  discountvalue: oldPrice ? parsed.discountpercentage : null,
                  taxclass: parsed.tax ,
                  VAT: parsed.VAT,
                   weight: parsed.weight ,
                   height: parsed.height ,
                   length: parsed.length ,
                   width: parsed.width ,
                   images: Array.isArray(parsed.images) ? parsed.images : product.images,
                   oldPrice

                }as Product;
              }
              return product;

            })

            this.products.sort((a, b) => a.name.localeCompare(b.name));

          },
          error: (err) => {
            console.error('Error fetching products:', err);
            this.hasError = true;
          }
      });
    }

  }

  // navigate to edit product page
  onUpdate(productId: string): void {
    this.router.navigate(['/admin/productlist/edit-product', productId]);
  }


  // search products
  Searchproducts():void{
    const searchTerm = this.searchText.toLowerCase();
    this.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    this.filterSelected=true;
    this.checkStopNext();
  }

// filter by date

closeDateRangePicker(){
 this.filterSelected=true;
  if(this.startDate && this.endDate){
    this.products = this.allProducts.filter(product => {
      const createdDate = new Date(product.createdOn);
      return createdDate >= this.startDate! && createdDate <= this.endDate!;
    });
    this.checkStopNext();
  }
}

// Filter by Category
OpenFilters():void{
  this.filterSelected=true;
  this.filterpopup=true;
}

CloseFilters():void{
  this.filterpopup=false;
  this.products = this.allProducts.filter(product => {
    const isTop = this.topsSelected && product.type.toLowerCase() === 'tops';
    const isBottom = this.bottomsSelected && product.type.toLowerCase() === 'bottoms';
    const isDress=this.dressesSelected && product.type.toLowerCase() === 'dresses';
    const isShoe = this.shoesSelected && product.type.toLowerCase() === 'shoes';
    const isAccessory = this.accessoriesSelected && product.type.toLowerCase() === 'accessories';
    return isTop || isBottom || isShoe || isAccessory||isDress; 
    
  });
  this.checkStopNext();
}

}
