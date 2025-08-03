import { Component, ViewChild } from '@angular/core';
import { PriceSliderComponent } from '../price-slider/price-slider.component';


@Component({
  selector: 'app-sidebar',
  imports: [PriceSliderComponent, ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class sidebarComponent {
  @ViewChild('priceSlider') priceSlider!: PriceSliderComponent;

  onSliderChange() {
    this.priceSlider.onSliderChange();
  }

}
