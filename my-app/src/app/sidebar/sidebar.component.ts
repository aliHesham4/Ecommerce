import { Component } from '@angular/core';
import { PriceSliderComponent } from '../price-slider/price-slider.component';


@Component({
  selector: 'app-sidebar',
  imports: [PriceSliderComponent, ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class sidebarComponent {

}
