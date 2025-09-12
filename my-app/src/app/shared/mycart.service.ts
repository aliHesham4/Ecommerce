import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Cart {
  customerId: string;
  orderItems: { productId: string; quantity: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MycartService {
  private platformId = inject(PLATFORM_ID);
  private loginID: string | null = null;
  private myCartSubject!: BehaviorSubject<Cart>;
  myCart$!: Observable<Cart>;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loginID = localStorage.getItem('loginID');
      if (this.loginID) {
        this.setUser(this.loginID);
      }
    }
  }

  addProduct(productID: string, quantity: number) {
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;
    const cart = this.myCartSubject.value;
    const existing = cart.orderItems.find(i => i.productId === productID);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.orderItems.push({ productId: productID, quantity });
    }
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));
    this.myCartSubject.next(cart);
  }

  removeProduct(productID: string) {
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;
    const cart = this.myCartSubject.value;
    cart.orderItems = cart.orderItems.filter(i => i.productId !== productID);
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));
    this.myCartSubject.next(cart);
  }

  clearCart() {
    if (!isPlatformBrowser(this.platformId) || !this.myCartSubject) return;
    const cart: Cart = { customerId: this.loginID ?? '', orderItems: [] };
    localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(cart));
    this.myCartSubject.next(cart);
  }

  setUser(loginID: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loginID = loginID;
    const storedCart = localStorage.getItem(`cart_${this.loginID}`);
    if (storedCart) {
      this.myCartSubject = new BehaviorSubject<Cart>(JSON.parse(storedCart));
    } else {
      const emptyCart: Cart = { customerId: this.loginID, orderItems: [] };
      this.myCartSubject = new BehaviorSubject<Cart>(emptyCart);
      localStorage.setItem(`cart_${this.loginID}`, JSON.stringify(emptyCart));
    }
    this.myCart$ = this.myCartSubject.asObservable();
  }
}