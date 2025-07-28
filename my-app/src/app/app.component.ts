import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductslistComponent } from './productslist/productslist.component';



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, NavbarComponent, ProductslistComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
}
