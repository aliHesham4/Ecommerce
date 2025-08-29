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
      taxclass:['standard']
    })
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

}
