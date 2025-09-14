import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-myorders',
  imports: [HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent implements CanActivate{
  TotalOrders:any[]=[];
  pageNumber:number=1;
  showDeletePopup=false;
  private platformId = inject(PLATFORM_ID); 
  orderIdToDelete: string | null = null;;
  constructor(private router: Router,private http: HttpClient){}

  ngOnInit(){
     this.loadOrders();
  }

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

  remove(){
    if (this.orderIdToDelete) {
      this.http.delete(`https://localhost:7096/api/Order/deleteorder/${this.orderIdToDelete}`)
        .subscribe({
          next: () => {
            this.showDeletePopup = false;
            this.loadOrders();
          this.orderIdToDelete = null;
       setTimeout(() => {
      alert("Order is deleted successfully, your order will be deleted shortly");
      }, 200);


          },
          error: (err) => {
            console.error('Error deleting product:', err);
          }
        });
    }

  }


  onDelete(orderID: string): void {
    this.showDeletePopup = true;
    this.orderIdToDelete = orderID;
  }


    closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.orderIdToDelete = null;

  }


  loadOrders(){
    if (!isPlatformBrowser(this.platformId)) return;
    const loginID= JSON.parse(localStorage.getItem('loginID')||'{}').loginID;
    this.http.get<{ data: any[] }>(`https://localhost:7096/api/Order/getallorders/${loginID}?pageNumber=${this.pageNumber}`).subscribe({
      next: (response)=>{
       this.TotalOrders = response.data
      },
      error: (err)=>{
        alert("Couldn't Fetch All Orders, Please try again")
      }
    })
  }





}
