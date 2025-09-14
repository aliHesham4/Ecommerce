import { Component } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';

@Component({
  selector: 'app-myorders',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent implements CanActivate{
  constructor(private router: Router){}

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



}
