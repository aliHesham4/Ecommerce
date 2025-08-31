import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {Router} from '@angular/router';

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
  "taxclass"?: string,
  "discounttype"?: string,
  "discountvalue"?: number,
  "images"?: string[],
  "length"?: number,
  "width"?: number,
  "height"?: number,
  "weight"?: number,


}

@Component({
  selector: 'app-adminproductlist',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css'
})


export class AdminproductlistComponent {
  select=false;
  searchText: string = ''; 
  loginID: string | null = null;
  hasError: boolean = false;
  products: Product[] = [];
  showDeletePopup: boolean = false;
  productIdToDelete: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute,@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    // get loginID from local storage
    if (isPlatformBrowser(this.platformId)) {
    this.loginID = localStorage.getItem('loginID');
    console.log('Admin loginID:', this.loginID);
    }

    this.fetchProducts();

  }

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


  fetchProducts():void{
    if (this.loginID) {
      this.http.get<{ data: Product[] }>(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=1`)
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
