import { Component, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PriceSliderComponent } from '../price-slider/price-slider.component';

@Component({
  selector: 'app-filterpopup',
  imports: [PriceSliderComponent],
  templateUrl: './filterpopup.component.html',
  styleUrl: './filterpopup.component.css'
})
export class FilterpopupComponent {

  constructor(private router: Router,private route: ActivatedRoute) {}

closePopup() {
  this.router.navigate(['/products',{ outlets: { popup: null } }]);
}

closePopupApply(){

 this.router.navigate(['/products',{ outlets: { popup: null } }]);

}

 @ViewChild('priceSlider') priceSlider!: PriceSliderComponent;

  onSliderChange() {
    this.priceSlider.onSliderChange();
  }


}
