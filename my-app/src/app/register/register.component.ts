import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../Done/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule,} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-register',
  imports: [FooterComponent, RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    errorMessage= "Something went wrong, please try again later.";
    registerForm!: FormGroup;
    private apiUrl = 'https://localhost:7096/api/Customer/register'; // Your API endpoint
   constructor(private formBuilder: FormBuilder,private router: Router,private http: HttpClient) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  


  onSubmit() {
    if (this.registerForm.get('email')?.value=="" || this.registerForm.get('password')?.value=="" || this.registerForm.get('confirmPassword')?.value==""){
      this.registerForm.markAllAsTouched();
    }
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
     
    }
     else if (this.registerForm.valid) {
      // const secretkey="Student123456";
      // const encryptedPassword = CryptoJS.AES.encrypt(this.registerForm.get('password')?.value, secretkey).toString();
      
        const userData = {
        name: this.registerForm.get('name')?.value,
        address: 'NA',
        phone: '0000000000000',
        email: this.registerForm.get('email')?.value,
         status: 'Active',
        password: this.registerForm.get('password')?.value
      };

      this.http.post(this.apiUrl, userData).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']); // Navigate to login page after successful registration
        },
        error: (error) => {
          console.error('Error registering user', error);
          if (error.error.message=="InValid Data"||error.error.message=="Invalid Data"){
            if (error.error.errors['Password']) {
            this.registerForm.get('password')?.setErrors({invalidpassword: true});

          }else if (error.error.errors['Validation Error:']) {
           this.registerForm.get('email')?.setErrors({emailexists: true});
          }else{
          alert(this.errorMessage);
          }
          
          }
        }
      });

    } else {
      console.log('Form is invalid');
    }

    
     

  
  }

}
