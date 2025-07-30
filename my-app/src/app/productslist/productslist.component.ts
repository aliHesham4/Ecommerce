import { Component } from '@angular/core';
import { ProductlayerComponent } from '../productlayer/productlayer.component';
import { NgFor } from '@angular/common';
import { HostListener,OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-productslist',
  imports: [ProductlayerComponent, NgFor],
  templateUrl: './productslist.component.html',
  styleUrl: './productslist.component.css'
})
export class ProductslistComponent implements OnInit {


  
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
    }

    
  ];

  currentpage=1;
  itemsperpage=4;

  ngOnInit() {
    this.updateItemsPerPage();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateItemsPerPage();
  }

  updateItemsPerPage() {
    const width = window.innerWidth;

    if (width >= 576) {
      this.itemsperpage = 9; // Small screens only
    } else {
      this.itemsperpage = 6;
    }
  }


get PaginatedProducts(){
  const start= (this.currentpage-1) * this.itemsperpage;
  return this.products.slice(start,start+ this.itemsperpage );
}

get totalPages(){
  return Math.ceil(this.products.length / this.itemsperpage);
}

changePage(page: number) {
  this.currentpage = page;
  window.scrollTo(0, 0); 
}




}




