import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';


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











  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
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
      // SKU: ['', Validators.required],
      stockquantity: ['', [Validators.required, Validators.min(0)]],
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
      status: ['draft']
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



 get progress(): number {
  const forms = [
    this.productForm,
    this.mediaForm,
    this.priceForm,
    this.inventoryForm,
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

  redirect(){
    
  }

}
