import { Component } from '@angular/core';
import {HeaderComponent } from '../Done/header/header.component';
import { sidebarComponent} from '../Done/sidebar/sidebar.component';
import { FooterComponent } from '../Done/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ProductslistComponent } from '../productslist/productslist.component';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-productspage',
  imports: [HeaderComponent, sidebarComponent, FooterComponent, ProductslistComponent],
  templateUrl: './productspage.component.html',
  styleUrl: './productspage.component.css'
})
export class ProductspageComponent implements CanActivate {
  constructor(private router:Router){}
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
