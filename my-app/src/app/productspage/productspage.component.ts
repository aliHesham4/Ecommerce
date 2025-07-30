import { Component } from '@angular/core';
import { ProductslistComponent } from '../productslist/productslist.component';
import {HeaderComponent } from '../header/header.component';
import { sidebarComponent} from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-productspage',
  imports: [ProductslistComponent, HeaderComponent, sidebarComponent, FooterComponent, RouterOutlet],
  templateUrl: './productspage.component.html',
  styleUrl: './productspage.component.css'
})
export class ProductspageComponent {

}
