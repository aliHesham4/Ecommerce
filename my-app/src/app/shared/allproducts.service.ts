import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';

@Injectable({
  providedIn: 'root'
})
export class AllproductsService {
  
  allproductspagination: number=1; // To track pagination for loading all products and to not interfere with main pagination
  stoppingloop:boolean=false; // To stop the loop when there are no more products to fetch to get all products
  loginID: string | null = null; // To store loginID from localStorage
  private allProductsSubject = new BehaviorSubject<Product[]>([]);
  allProducts$ = this.allProductsSubject.asObservable();
  constructor(private http: HttpClient) { }


// load all products because the API does not support filtering and searching
async loadAllproducts(){
  try{
   while (!this.stoppingloop) {
    const response = await firstValueFrom(this.http.get<{ data: Product[] }>(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=${this.allproductspagination}`));
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
          this.allProductsSubject.next([...this.allProductsSubject.getValue(), ...mergedProducts]);
          this.allproductspagination++;
        }
      }
      
    }catch(error){
      console.error('Error fetching all products:', error);
    }

}

}
