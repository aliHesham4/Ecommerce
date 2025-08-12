import { Component, OnDestroy } from '@angular/core';
import { ProductlayerComponent } from '../Done/productlayer/productlayer.component';
import { NgFor,NgIf } from '@angular/common';
import { HostListener,OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterOutlet } from '@angular/router';
import { SearchService } from '../shared/search.service';
import { PriceService } from '../shared/price.service';
import {Subscription } from 'rxjs';



@Component({
  selector: 'app-productslist',
  imports: [ProductlayerComponent, NgFor,NgIf,RouterOutlet], // <-- Add RouterOutlet here
  templateUrl: './productslist.component.html',
  styleUrl: './productslist.component.css'
})
export class ProductslistComponent implements OnInit,OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService,private priceService: PriceService) {}
  searchTerm: string = '';
  private sub!: Subscription;
  private priceSub!: Subscription;
  
  openPopup() {
  this.router.navigate(['/products', { outlets: { popup: ['filter'] } }]);
}


  
  
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

  currentpage=1;
  itemsperpage=9;
  priceRange = { min: 0, max: 250 };
 

  ngOnInit() {
    this.updateItemsPerPage();
    this.sub= this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.updateItemsPerPage(); // Update items per page on search term change
    });
    this.priceSub = this.priceService.priceRange$.subscribe(range => {
      this.priceRange = range;
      this.updateItemsPerPage(); // Update items per page on price range change
    });

  }


  ngOnDestroy() {
  if (this.sub) {
    this.sub.unsubscribe();
  }
  if (this.priceSub) {
    this.priceSub.unsubscribe();
}
  }


  @HostListener('window:resize')
  onResize() {
    this.updateItemsPerPage();
  }

  updateItemsPerPage() {
    const width = window.innerWidth;
    const filteredCount = this.filteredProducts.length;
   
    if (width <= 576) {
      this.itemsperpage = 6;
    } else {
      this.itemsperpage = 9;
    }
  }

get filteredProducts() {
  return this.products.filter(product =>
    product.title.toLowerCase().includes(this.searchTerm.toLowerCase())&&
    product.price >= this.priceRange.min &&
    product.price <= this.priceRange.max
  );
}
get PaginatedProducts(){
  const start= (this.currentpage-1) * this.itemsperpage;
  return this.filteredProducts.slice(start,start+ this.itemsperpage );
}

get totalPages(){
  return Math.ceil(this.filteredProducts.length / this.itemsperpage);
}

changePage(page: number) {
  this.currentpage = page;
  window.scrollTo(0, 0); 
}


getMin(a: number, b: number): number {
  return Math.min(a, b);
}




}




