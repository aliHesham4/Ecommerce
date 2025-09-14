import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Cart {
  customerId: string;
  orderItems: { productId: string; quantity: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MycartService {
  private platformId = inject(PLATFORM_ID);   //for login to be defined
  private loginID: string | null = null;      //initalization of loginID
  private myCartSubject!: BehaviorSubject<Cart>;  //myCartSubject
  myCart$!: Observable<Cart>;     //myCart observable
  productsID: string[]=[];       // array to store productsID to fetch them one by one
  allProductsInCart: Product[]=[];   //all products in cart in an array

  constructor(private http: HttpClient,private Router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID;  //getloginID
      if (this.loginID) {
        this.setUser(this.loginID);     // set User
      }else{
        alert("something went wrong, please try again");
         this.Router.navigateByUrl('/login');
        
      }
    }
    
  }

  addProduct(productID: string, quantity: number) {   //addProduct + take productID and quantity to be added
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;  
    const cart = this.myCartSubject.value;   //cart = what is inside mycartSubject
    const existing = cart.orderItems.find(i => i.productId === productID);   //if productId exist already in cart
    if (existing) {
      existing.quantity += quantity;  //add on existing quantity
    } else {
      cart.orderItems.push({ productId: productID, quantity });  // else push product into cart
      this.productsID.push(productID);  //and push the productid into arrray that fetch products
    }
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));  //save cart 
  }

  removeProduct(productID: string) {  //remove product taking productID
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;
    const cart = this.myCartSubject.value;  //cart = what is inside mycartSubject
    cart.orderItems = cart.orderItems.filter(i => i.productId !== productID); // remove the product from orderItems
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));  //save cart
    const index = this.productsID.indexOf(productID); //remove productID from array since remove
    if (index > -1) {
      this.productsID.splice(index, 1);
    }
    
  }

  clearCart() {
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;
    const cart: Cart = { customerId: this.loginID ?? '', orderItems: [] };  //make cart empty
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));   //save cart
    this.productsID=[];   //clear productsID
  }

  setUser(loginID: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loginID = loginID;   //make loginID = the loginID taken as an argument
    const storedCart = localStorage.getItem(`cart_${this.loginID}`);  //get storedCart from local storage
    if (storedCart) {                                  // if a stored local storage is there
      const parsedCart: Cart= JSON.parse(storedCart);  // parseCrt so it can be accessible
      this.myCartSubject = new BehaviorSubject<Cart>(parsedCart); // mycartSubject = the stored one
        this.productsID = parsedCart.orderItems.map(i => i.productId); // declare productsID and add the ids from cart.orderItems to array
    } else {
      const emptyCart: Cart = { customerId: this.loginID, orderItems: [] };    //make an empty cart
      this.myCartSubject = new BehaviorSubject<Cart>(emptyCart);  // mycartSubject= new empty cart
      this.productsID=[]; // make this.productsID empty
      localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(emptyCart)); // save cart now in local storage
    }
    this.myCart$ = this.myCartSubject.asObservable();  // mycartSubject is now put in  an observable
  }


  get TotalValue(){
    const cart= this.myCartSubject.value;  //cart = what is inside mycartSubject; whhich gets its content from local storage
    var totalAmount= 0;  // totalamount= 0
    for (const product of this.allProductsInCart) {  //loop through allProductsinCart and get price of each product and add it on total
       var number=1;
       const item= (cart.orderItems.find(i=> i.productId==product.id));
       if (item && item.quantity !== 1) 
       number=item.quantity;
      totalAmount+= product.amount*number; 
  }
  return totalAmount;
}

get TotalDiscountValue(){
    const cart= this.myCartSubject.value;   //like totalValue() but for discount
    var discountAmount= 0;
    for (const product of this.allProductsInCart) {
       var number=1;
       const item= (cart.orderItems.find(i=> i.productId==product.id));
       if (item && item.quantity !== 1) 
       number=item.quantity;
      discountAmount += (((product.discountvalue ?? 0)/100)*product.amount) * number; 
  }
  return Math.ceil(discountAmount);
}


addOrder(){
   const cart= this.myCartSubject.value;
   if(cart.orderItems.length > 0){
   this.http.post('https://localhost:7096/api/Order/addorder', cart)
      .subscribe({
        next: () => {
          alert("Order Placed Succesfully, Thank you for shopping with us!");
          setTimeout(() => { this.Router.navigate(['/myOrders/']);}, 200);
          const cart: Cart = { customerId: this.loginID ?? '', orderItems: [] };  //make cart empty
          localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));   //save cart
          this.productsID=[];   //clear productsID
          
        },
        error: (err) => {
          if(err.error?.errors){
           alert(err.error.errors["Validation Error:"][0]);
          }else{
          console.error("Order failed:", err);
          alert("Could not place order, please try again.");
          }
          
        }
      });

    }

}

}