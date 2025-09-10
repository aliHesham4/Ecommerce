import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AllproductsService } from '../../shared/allproducts.service';


@Component({
  selector: 'app-addproduct',
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent {

productForm: FormGroup;
mediaForm: FormGroup;
priceForm: FormGroup;
inventoryForm: FormGroup;
shippingForm: FormGroup;
categoryStatusForm: FormGroup;











  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private AllProductsService: AllproductsService) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(120)]]
    });
    this.mediaForm=  this.fb.group({
      media: this.fb.array([],[Validators.required])
    });

    this.priceForm=this.fb.group({
      baseprice: ['',[Validators.required]],
      discounttype:['percentage'],
      taxclass:['standard'],
      discountper: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      VAT: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.inventoryForm = this.fb.group({
       SKU: ['', Validators.required],
       stockQuantity: ['', [Validators.required, Validators.min(0)]],
    });

    this.shippingForm = this.fb.group({
      isPhysical: [true],
      weight: ['', [Validators.required, Validators.min(0)]],
      height: ['', [Validators.required, Validators.min(0)]],
      width: ['', [Validators.required, Validators.min(0)]],
      length: ['', [Validators.required, Validators.min(0)]]
    });
    this.categoryStatusForm = this.fb.group({
      category: ['', Validators.required],
      status: ['InStock']
    });

  this.shippingForm.get('isPhysical')?.valueChanges.subscribe((isPhysical: boolean) => {
  if (isPhysical) {
    this.shippingForm.get('weight')?.enable();
    this.shippingForm.get('height')?.enable();
    this.shippingForm.get('width')?.enable();
    this.shippingForm.get('length')?.enable();
  } else {
    this.shippingForm.get('weight')?.disable();
    this.shippingForm.get('height')?.disable();
    this.shippingForm.get('width')?.disable();
    this.shippingForm.get('length')?.disable();
  }
});


  }

 onSave(){
  if(this.productForm.invalid && this.mediaForm.invalid && this.priceForm.invalid
   && this.inventoryForm.invalid
    && this.shippingForm.invalid && this.categoryStatusForm.invalid){
   this.productForm.markAllAsTouched();
  this.mediaForm.markAllAsTouched();
  this.priceForm.markAllAsTouched();
  this.inventoryForm.markAllAsTouched();
  this.shippingForm.markAllAsTouched();
  this.categoryStatusForm.markAllAsTouched();
   }
   else{

  const productImages = [...this.media.value];

const data={
name: this.productForm.get('productName')?.value,
description: this.productForm.get('description')?.value,
amount: this.priceForm.get('baseprice')?.value,
type: this.categoryStatusForm.get('category')?.value,
stockQuantity: this.inventoryForm.get('stockQuantity')?.value,
status: this.categoryStatusForm.get('status')?.value,
// productImages: productImages

};



const APIurl = "https://localhost:7096/api/Product/addproduct";

 this.http.post<any>(APIurl, data).subscribe({
  next: (response) => {
    if (response?.data?.id) {
      const extraData = {
        sku: this.inventoryForm.get('SKU')?.value,
        discounttype: this.priceForm.get('discounttype')?.value,
        discountpercentage: this.priceForm.get('discountper')?.value,
        tax: this.priceForm.get('taxclass')?.value,
        VAT: this.priceForm.get('VAT')?.value,
        weight: this.shippingForm.get('weight')?.value,
        height: this.shippingForm.get('height')?.value,
        length: this.shippingForm.get('length')?.value,
        width: this.shippingForm.get('width')?.value,
        images: productImages
      };
      const productId = response.data.id;

      localStorage.setItem(`product-${productId}`, JSON.stringify(extraData));
      console.log('Product saved locally:', extraData);
      
      this.router.navigate(['/admin/productlist']).then(()=>{
      alert("Product is added successfully, please refresh the page");
      });
      
    } else {
      console.error('Invalid response structure:', response);
    }
  },
  error: (err) => {
    console.error('API Error:', err);
    alert('Failed to add product. Please try again.');
  }
});
  this.AllProductsService.loadAllproducts();
}
}


 get progress(): number {
  const forms = [
    this.productForm,
    this.mediaForm,
    this.priceForm,
    this.shippingForm,
    this.categoryStatusForm
  ];

  const completedForms = forms.filter(form => form.valid).length;
  return (completedForms / forms.length) * 100;
}

getProgressColor(): string {
  if (this.progress >= 100) return 'green';
  if (this.progress >= 75) return 'lightgreen';
  if (this.progress >= 50) return 'orange';
  if (this.progress >= 25) return 'lightcoral'; // lighter red
  return 'red';
}
// ------------------------------------media import logic----------------------------
  get media(): FormArray {
  return this.mediaForm.get('media') as FormArray;
}
onFilesSelected(event: Event) :void{
const input = event.target as HTMLInputElement;
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if(this.media.length<3)
      this.media.push(this.fb.control(file.name)); 
      else if(input.files.length+this.media.length>3){
      this.media.setErrors({ maxNum: true });
      break;
      }
    }
   
  }
  }

  removeFile(index: number): void {
    this.media.removeAt(index);
  }

  // ------------------------------------------------


}
