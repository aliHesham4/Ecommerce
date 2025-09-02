import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {Router} from '@angular/router';
import { response } from 'express';


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
  "oldPrice"?: number


}

@Component({
  selector: 'app-adminproductlist',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css'
})


export class AdminproductlistComponent {
  selectAll: boolean = false;
  searchText: string = ''; 
  loginID: string | null = null;
  hasError: boolean = false;
  products: Product[] = [];
  showDeletePopup: boolean = false;
  productIdToDelete: string | null = null;
  on: boolean = true;
  onP: boolean = true; 
  onD: boolean=true;
  pageNumber: number = 1;
  stopNext: boolean=false;
  allProducts:Product[]=[];

  stoppingloop:boolean=false;

  constructor(private http: HttpClient, private route: ActivatedRoute,@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    // get loginID from local storage
    if (isPlatformBrowser(this.platformId)) {
    this.loginID = localStorage.getItem('loginID');
    console.log('Admin loginID:', this.loginID);
    }

    this.fetchProducts();
    

// -------------------------------------
 while (!this.stoppingloop) {
  this.http.get<{ data: Product[] }>(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=${this.pageNumber}`)
    .subscribe({
      next: (response) => {
        if (response.data.length == 0) {
          this.stoppingloop = true;
        } else {
          // Merge localStorage data into each product
          const mergedProducts = response.data.map(product => {
            const key = `product-${product.id}`;
            const localData = localStorage.getItem(key);

            if (localData) {
              const parsed = JSON.parse(localData);
              return {
                ...product,
                SKU: parsed.sku,
                discounttype: parsed.discounttype,
                VAT: parsed.VAT,
                taxclass: parsed.tax,
                discountvalue: parsed.discountpercentage,
                images: Array.isArray(parsed.images) ? parsed.images : product.images,
                weight: parsed.weight,
                height: parsed.height,
                length: parsed.length,
                width: parsed.width,
                oldPrice: ((parsed.discountpercentage + 100) / 100) * product.amount
              };
            }

            return product;
          });

          // Push merged products to allProducts
          this.allProducts.push(...mergedProducts);
          this.pageNumber++;
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.stoppingloop = true; 
      }
    });
}

alert(this.allProducts.length);

  }

  toggleSelectAll(): void {
  this.products.forEach(product => product.selected = this.selectAll);
}

// Check if all items are selected and update header checkbox
checkIfAllSelected(): void {
  this.selectAll = this.products.every(product => product.selected);
}

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

  previousPage(): void {
   
      this.pageNumber--;
      this.fetchProducts();
      this.stopNext = false;
    
  }
  nextPage(): void {
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

  onDelete(productId: string): void {
    console.log('hereeee');
    
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

  openPreviewPopup(productID: string):void{
    this.router.navigate([{ outlets: { popup: ['preview', productID] } }],{ relativeTo: this.route });
  }


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
                return {
                  ...product,
                  discounttype: parsed.discounttype,
                  SKU: parsed.sku,
                  discountvalue: parsed.discountpercentage,
                  taxclass: parsed.tax ,
                  VAT: parsed.VAT,
                   weight: parsed.weight ,
                   height: parsed.height ,
                   length: parsed.length ,
                   width: parsed.width ,
                   images: Array.isArray(parsed.images) ? parsed.images : product.images
                };
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


  onUpdate(productId: string): void {
    this.router.navigate(['/admin/productlist/edit-product', productId]);
  }








}
