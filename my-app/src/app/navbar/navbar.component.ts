import { Component } from '@angular/core';
import { PriceSliderComponent } from '../price-slider/price-slider.component';

@Component({
  selector: 'app-navbar',
  imports: [PriceSliderComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

}
