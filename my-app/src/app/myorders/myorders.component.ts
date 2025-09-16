import { Component, inject, PLATFORM_ID } from '@angular/core';

import { Router } from '@angular/router';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, takeWhile } from 'rxjs';
@Component({
  selector: 'app-myorders',
  imports: [HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent {
  TotalOrders:any[]=[];
  pageNumber:number=1;
  showDeletePopup=false;
  private platformId = inject(PLATFORM_ID); 
  orderIdToDelete: string | null = null;
  loading: boolean = false;
  deletedOrder: string | null = null;


  constructor(private router: Router,private http: HttpClient){}

  ngOnInit(){
     this.loadOrders();
  }



  remove() {
  const loginID = JSON.parse(localStorage.getItem('loginID')||'{}').loginID;
  if (this.orderIdToDelete) {
    this.loading = true;
    this.http.delete(`https://localhost:7096/api/Order/deleteorder/${this.orderIdToDelete}`)
      .subscribe({
        next: () => {
          this.showDeletePopup = false;

          interval(2000).pipe(
            switchMap(() => this.http.get<{ data: any[] }>(
              `https://localhost:7096/api/Order/getallorders/${loginID}?pageNumber=${this.pageNumber}`
            )),
            takeWhile(response => response.data.some(o => o.id === this.orderIdToDelete))
          ).subscribe({
            complete: () => {
              // once backend reflects deletion → reload clean list
              this.loadOrders();
              this.orderIdToDelete = null;
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.loading = false;
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
       this.TotalOrders = response.data.filter(o => o.isDeleted ===false);
      },
      error: (err)=>{
        alert("Couldn't Fetch All Orders, Please try again")
      }
    })
  }





}
