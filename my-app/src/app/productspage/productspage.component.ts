import { Component } from '@angular/core';
import {HeaderComponent } from '../header/header.component';
import { sidebarComponent} from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-productspage',
  imports: [HeaderComponent, sidebarComponent, FooterComponent, RouterOutlet],
  templateUrl: './productspage.component.html',
  styleUrl: './productspage.component.css'
})
export class ProductspageComponent {

}
