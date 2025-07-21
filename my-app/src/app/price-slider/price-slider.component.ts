import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-slider',
  imports: [FormsModule, CommonModule],
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.css']
})
export class PriceSliderComponent {
  min = 0;
  max = 250;
  minValue = 50;
  maxValue = 200;

  onMinChange() {
    if (this.minValue > this.maxValue - 1) {
      this.minValue = this.maxValue - 40;
      
    }
  }

  onMaxChange() {
    if (this.maxValue < this.minValue + 1) {
      this.maxValue = this.minValue + 40;
    }
  }

  getTrackStyle() {
    const left = ((this.minValue - this.min) / (this.max - this.min)) * 100;
    const right = 100 - ((this.maxValue - this.min) / (this.max - this.min)) * 100;
    return {
      background: `linear-gradient(to right, #ccc ${left}%, black ${left}%, black ${100 - right}%, #ccc ${100 - right}%)`
    };
  }
  
}
