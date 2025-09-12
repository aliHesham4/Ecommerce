import { Component, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../Done/header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart, MycartService } from '../shared/mycart.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';
import { CanActivate } from '@angular/router';


@Component({
  selector: 'app-cart',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements CanActivate {
loginID: string | null = null; // To store loginID from localStorage
productIDs:string[]=[];        // array to store productsID to fetch them one by one
cart: Cart | null = null;
allProductsInCart: Product[]=[]; //all products in cart in an array
totalAmount:number=0;
discountAmount:number=0;

canActivate(): boolean {
    const loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID; // ✅ check if logged in
    if (loginID) {
      return true; // allow access
    } else {
      alert("You must log in to access this page.");
      this.router.navigate(['/login']); // redirect to login
      return false; // block access
    }
  }
constructor(private router:Router,private MycartService: MycartService,private http: HttpClient){}

  ngOnInit():void{
   if(isPlatformBrowser(PLATFORM_ID)){              //check so that localstorage is defined
    this.loginID=JSON.parse(localStorage.getItem('loginID') || '{}').loginID;
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
    this.MycartService.myCart$?.subscribe(async cart => {      //any change that happens to mycart gets saved in cart
      this.cart = cart;
      this.productIDs=this.MycartService.productsID;              //save productIDs in service here
      

    
       //  ---------------------------------- add all thing in myCart to cart and productIDs in an array
    for (let id of this.productIDs){   //loop through productsID to fetch each product
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
          isSelected: parsed.images[0],     //to get picture on display
          quantityTaken: this.cart?.orderItems.find(i => i.productId === id)?.quantity ?? 1   // quantity of this specific product in cart
        } 
        }   
         this.allProductsInCart.push(product);  //after fetching push it inside allProductsInCart
         this.MycartService.allProductsInCart=this.allProductsInCart;     //since functions work for service, add all productsIncart to service
         this.totalAmount= this.MycartService.TotalValue;    // get total value
        this.discountAmount=this.MycartService.TotalDiscountValue;  // get discount value
         

        },error: (err)=>{
          console.log("error occured,please try again");
        }
      });
       
      }
       
     
    });
    
 
}


 add(productID:string,stockQuantity:number):void{    
   const product = this.allProductsInCart.find(p => p.id === productID);   //get product from id
    if (product && (product.quantityTaken ?? 0) < stockQuantity ) {  //add quantities while < stockQuantity
      this.MycartService.addProduct(productID, +1);  
      product.quantityTaken = (product.quantityTaken ?? 0) + 1; // for immediate increase in add
      this.totalAmount= this.MycartService.TotalValue;  //update totalvalue
       this.discountAmount=this.MycartService.TotalDiscountValue;  //update discount amount

    }
   }

   subtract(productID:string,stockQuantity:number):void{    //same logic like add
    const product = this.allProductsInCart.find(p => p.id === productID);
    if (product && (product.quantityTaken ?? 0) > 1 ) {
      this.MycartService.addProduct(productID, -1);
      product.quantityTaken = (product.quantityTaken ?? 0) - 1;
      this.totalAmount= this.MycartService.TotalValue;
       this.discountAmount=this.MycartService.TotalDiscountValue;
    }
    

}

remove(productID:string){
  this.MycartService.removeProduct(productID);// removeProduct from cart
   this.allProductsInCart = this.allProductsInCart.filter(p => p.id !== productID);  //remove it from html
   this.MycartService.allProductsInCart=this.allProductsInCart;
   this.totalAmount= this.MycartService.TotalValue;
   this.discountAmount=this.MycartService.TotalDiscountValue;
}

}

