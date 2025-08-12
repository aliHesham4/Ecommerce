import { Component } from '@angular/core';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';


@Component({
  selector: 'app-productdetail',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {

  selected = 'assets/productdetail.png';

  onPreviewClick(imagePath: string) {
    this.selected = imagePath;
  }
}


