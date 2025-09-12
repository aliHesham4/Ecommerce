import { Component,input,Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-productlayer',
  imports: [CommonModule, ],
  templateUrl: './productlayer.component.html',
  styleUrl: './productlayer.component.css'
})
export class ProductlayerComponent {
@Input() images: string ='';
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() amount: number = 0;
  @Input() oldPrice?: number;
  @Input() discountpercent?: number;
  @Input() productID:string='';
  

  constructor(private router:Router) {}


  chooseProduct(productID: string ):void{
   this.router.navigate(['/product/', productID]);
   scroll(0,0);
}


}


