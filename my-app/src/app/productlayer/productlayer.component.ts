import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';  



@Component({
  selector: 'app-productlayer',
  imports: [CommonModule, ],
  templateUrl: './productlayer.component.html',
  styleUrl: './productlayer.component.css'
})
export class ProductlayerComponent {
@Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() oldPrice?: number; // optional old price

}
