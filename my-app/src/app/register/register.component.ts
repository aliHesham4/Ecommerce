import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../Done/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule,} from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-register',
  imports: [FooterComponent, RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm!: FormGroup;
   constructor(private formBuilder: FormBuilder,private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });

    }else if (localStorage.getItem(this.registerForm.get('email')?.value)!== null) {
      this.registerForm.get('email')?.setErrors({ emailExists: true });
    }
     else if (this.registerForm.valid) {
       localStorage.setItem(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value);

      console.log('Form Submitted', this.registerForm.value);
      this.router.navigate(['/login']); // Navigate to login page after successful registration
    } else {
      console.log('Form is invalid');
    }

    
     

  
  }

}
