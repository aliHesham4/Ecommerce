import { Component } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../Done/footer/footer.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormGroup,FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FooterComponent,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false] // Optional field for "Remember Me" functionality
    });
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (localStorage.getItem(email) === password) {
      console.log('Login successful');
      this.router.navigate(['/products']); 
    } else {
      this.loginForm.get('email')?.setErrors({ emailExists: true });
      console.log('Email or password is incorrect');
    }
  }


}
