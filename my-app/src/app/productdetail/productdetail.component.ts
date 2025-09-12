import { Component, HostListener, inject } from '@angular/core';
import { HeaderComponent } from '../Done/header/header.component';
import { FooterComponent } from '../Done/footer/footer.component';
import { ProductlayerComponent } from '../Done/productlayer/productlayer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product } from '../AdminNavbar/adminproductlist/adminproductlist.component';
import { PLATFORM_ID, Inject } from '@angular/core';
import { AllproductsService } from '../shared/allproducts.service';
import { ActivatedRoute, Router,RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MycartService } from '../shared/mycart.service';
import { CanActivate } from '@angular/router';


@Component({
  selector: 'app-productdetail',
  imports: [HeaderComponent, FooterComponent,ProductlayerComponent, CommonModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css',
})
export class ProductdetailComponent implements CanActivate {
  products:Product[]=[];
  selected: string = '';
  itemquantity= 1;
  loginID='';
  shuffledProducts!: any[];
  private platformId = inject(PLATFORM_ID);
  private id='';
  product: Product | null = null;

  constructor(private router: Router, private route: ActivatedRoute,private AllProductsService: AllproductsService, private http:HttpClient,private MycartService: MycartService) {}
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.loginID = localStorage.getItem('loginID') || '';
    console.log('Admin loginID:', this.loginID);

    if (!this.loginID) {
      alert("You are not logged in,please log in to access our website")
      setTimeout(()=>{
      this.router.navigate(['/login']);
      },500
      )
      return; // stop here if loginID is missing
    }

    this.AllProductsService.loginID = this.loginID; 
    this.AllProductsService.loadAllproducts(); // ✅ move inside the if
    this.AllProductsService.allProducts$.subscribe(products => {
      this.products = products;
      console.log(products.length);

      // Shuffle after products arrive, not before
      this.shuffledProducts = [...this.products].sort(() => Math.random() - 0.5);
    });
     this.id = this.route.snapshot.paramMap.get('id') || '';

    this.getProduct();

}
 }



  getRandomProducts() {
    if (isPlatformBrowser(this.platformId)){
    const width = window.innerWidth;
     let count: number;
     if(width<= 500){
      count=1;
    }else if (width <= 1040) {
     count = 2;
    } else if (width <= 1380) {
     count = 3;
     } else {
      count = 4;
    }

    return [...this.shuffledProducts] // copy the array so we don’t mutate original
     .slice(0,count); 
  }
  return
}
   

 refreshPage(productID: string) {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {  //this tricks angular router to go to root but without updating Url then go 
    this.router.navigate(['/product', productID]);                           // to the same page I am on so it does a refresh
  });
}



 @HostListener('window:resize')
  onResize() {
    this.getRandomProducts();
  }
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

  getProduct(){
    this.http
  .get<{ data: Product }>(`https://localhost:7096/api/Product/getproductbyid/${this.id}`)
  .subscribe({
    next: (res) => {
      let product = res.data;

      const key = `product-${this.id}`;
      const localData = localStorage.getItem(key);

      if (localData) {
        const parsed = JSON.parse(localData);

        const oldPrice =
          parsed.discountpercentage != 0
            ? Math.round(((parsed.discountpercentage + 100) / 100) * product.amount)
            : null;

        product = {
          ...product,
          discounttype: parsed.discounttype,
          SKU: parsed.sku,
          discountvalue: oldPrice ? parsed.discountpercentage : null,
          taxclass: parsed.tax,
          VAT: parsed.VAT,
          weight: parsed.weight,
          height: parsed.height,
          length: parsed.length,
          width: parsed.width,
          images: Array.isArray(parsed.images) ? parsed.images : product.images,
          oldPrice,
        } as Product;
      }

      // ✅ finally set the merged result
      this.product = product;
      this.selected = 'assets/' + (this.product?.images?.[0] || '');
      console.log('Final merged product:', this.product);
    },
    error: (err) => {
      console.error('Error fetching product:', err);
    },
  });
  }

  addtocart(){
    this.MycartService.addProduct(this.id,this.itemquantity);
    alert("product is added to cart successfully!");
  }



  canActivate(): boolean {
    const loginID = JSON.parse(localStorage.getItem('loginID') || '{}').loginID; // ✅ check if logged in
    if (loginID) {
      return true; // allow access
    } else {
      alert("You must log in to access this page.");
      this.router.navigate(['/login']); // redirect to login
      return false; // block access
    }
  }

}





