import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../adminproductlist/adminproductlist.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-previewpopup',
  imports: [CommonModule],
  templateUrl: './previewpopup.component.html',
  styleUrl: './previewpopup.component.css'
})
export class PreviewpopupComponent {
  productID: string | null = null;
  product: Product | null = null;
  parsed: any;
  constructor(private route: ActivatedRoute,private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productID = params['id'];
    });
     this.http.get<{ data: Product }>(`https://localhost:7096/api/Product/getproductbyid/${this.productID}`)
        .subscribe({
          next: (response) => {
            this.product = response.data;
            const key=`product-${this.productID}`;
              const localData= localStorage.getItem(key);
              if (localData) {
                const parsed=JSON.parse(localData);
                this.product.SKU=parsed.sku;
                this.product.discounttype=parsed.discounttype;
                this.product.VAT=parsed.VAT;
                this.product.taxclass=parsed.tax;
                this.product.discountvalue=parsed.discountpercentage
                this.product.images= Array.isArray(parsed.images) ? parsed.images : this.product.images;
                this.product.weight=parsed.weight;
                this.product.height=parsed.height;
                this.product.length=parsed.length;
                this.product.width=parsed.width;
                if(this.product.discountvalue!=0)
                this.product.oldPrice=(parsed.discountpercentage+100)/100*this.product.amount
              }
            console.log('Product fetched:', this.product);

          },
          error: (error) => {
            console.error('Error fetching product:', error);
          }
        });
  }


closePopup() {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/admin/productlist']);
  });
}

}