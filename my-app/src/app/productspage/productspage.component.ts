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
export class ProductspageComponent  {
  constructor(private router:Router){}


}
