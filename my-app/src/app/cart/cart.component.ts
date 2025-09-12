import { Component, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../Done/header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart, MycartService } from '../shared/mycart.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
loginID: string | null = null; // To store loginID from localStorage
productIDs:string[]=[];
cart: Cart | null = null;
allProductsInCart: Product[]=[];


constructor(private router:Router,private MycartService: MycartService,private http: HttpClient){}

  ngOnInit():void{
   if(isPlatformBrowser(PLATFORM_ID)){
    this.loginID=localStorage.getItem('loginID');
    if(!this.loginID){
      alert("You are not logged in,please log in to access our website")
      setTimeout(()=>{
      this.router.navigate(['/login']);
      },500
      )
      return; 
    }
   }
  //  ----------------------------------------------------------
    this.MycartService.myCart$?.subscribe(cart => {
      this.cart = cart;
      this.productIDs = cart.orderItems.map(item => item.productId);
    });
  //  ---------------------------------- add all thing in myCart to cart and productIDs in an array
    for (let id of this.productIDs){
      this.http.get<{ data: Product }>(`https://localhost:7096/api/Product/getproductbyid/${id}`).subscribe({
    next: (res) => {
      let product = res.data;

      const key = `product-${id}`;
      const localData = localStorage.getItem(key);

      if (localData) {
        const parsed = JSON.parse(localData);

        const oldPrice =
          parsed.discountpercentage != 0
            ? Math.round(((parsed.discountpercentage + 100) / 100) * product.amount)
            : undefined;

        product = {
          ...product,
          discounttype: parsed.discounttype,
          SKU: parsed.sku,
          discountvalue: oldPrice ? parsed.discountpercentage : null,
          taxclass: parsed.tax,
          VAT: parsed.VAT,
          weight: parsed.weight,
          height: parsed.height,
          length: parsed.length,
          width: parsed.width,
          images: Array.isArray(parsed.images) ? parsed.images : product.images,
          oldPrice,
          isSelected: parsed.images[0],
          quantityTaken: this.cart?.orderItems.find(i => i.productId === id)?.quantity ?? 1
        } 
        }
        this.allProductsInCart.push(product);

        },error: (err)=>{
          console.log("error occured,please try again");
        }});
      }
}

   add(productID:string,stockQuantity:number):void{
    
    this.MycartService.addProduct(productID,1);
    const product = this.allProductsInCart.find(p => p.id === productID);
  if (product) product.quantityTaken = (product.quantityTaken ?? 0) + 1;
   }

   subtract(productID:string,stockQuantity:number):void{
   
    this.MycartService.addProduct(productID,-1);
    const product = this.allProductsInCart.find(p => p.id === productID);
  if (product) product.quantityTaken = (product.quantityTaken ?? 0) - 1;
    
   }

   



}
