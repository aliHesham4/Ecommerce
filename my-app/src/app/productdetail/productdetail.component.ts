import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';
import { ProductlayerComponent } from '../Done/productlayer/productlayer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-productdetail',
  imports: [HeaderComponent, FooterComponent,ProductlayerComponent, CommonModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css',
})
export class ProductdetailComponent {

   products = [
    {
      imageUrl: 'assets/product1.png',
      title: 'Gradient Graphic T-shirt ',
      rating: 3.5,
      price: 145
      
    },
    {
      imageUrl: 'assets/product2.png',
      title: 'Polo with Tipping Details',
      rating: 4.5,
      price: 180
    }
    ,
    {
      imageUrl: 'assets/product3.png',
      title: 'Black Striped T-shirt',
      rating: 5.0,
      price: 120,
      oldPrice: 150 
    },
    {
      imageUrl: 'assets/product4.png',
      title: 'Skinny Fit Jeans',
      rating: 3.5,
      price: 240,
      oldPrice: 260
    },
    {
      imageUrl: 'assets/product5.png',
      title: 'Checkered Shirt',
      rating: 4.5,
      price: 180
    },
    {
      imageUrl: 'assets/product6.png',
      title: 'Sleeve Striped Tshirt',
      rating: 4.5,
      price: 130,
      oldPrice: 160
    },
    {
      imageUrl: 'assets/product7.png',
      title: 'Vertical Striped Shirt',
      rating: 5.0,
      price: 212,
      oldPrice: 232
    },
    {
      imageUrl: 'assets/product8.png',
      title: 'Courage Graphic T-shirt',
      rating: 4.0,
      price: 145
    },
    {
      imageUrl: 'assets/product9.png',
      title: 'Loose Fit Bermuda Shorts',
      rating: 3.0,
      price: 80,
    },

    {
      imageUrl: 'assets/product10.png',
      title: 'Blue Regular Polo T-shirt',
      rating: 4.0,
      price: 200,
      oldPrice: 220
    }
    

    
  ];
  
  selected = 'assets/productdetail.png';
  itemquantity= 1;
  onPreviewClick(imagePath: string) {
    this.selected = imagePath;
  }

  add(){
    if(this.itemquantity<99)
    this.itemquantity++;
  }

  subtract(){
    if(this.itemquantity>1)
    this.itemquantity--;
  }
  shuffledProducts!: any[];
  ngOnInit() {
  // Shuffle once on component load
  this.shuffledProducts = [...this.products].sort(() => Math.random() - 0.5);
}

  getRandomProducts() {
    const width = window.innerWidth;
     const count = width < 800 ? 2 : 4;
    return [...this.shuffledProducts] // copy the array so we don’t mutate original
     .slice(0,count); 
  }
    


 @HostListener('window:resize')
  onResize() {
    this.getRandomProducts();
  }



}


