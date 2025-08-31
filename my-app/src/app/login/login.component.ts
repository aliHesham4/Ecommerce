import { Component } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../Done/footer/footer.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormGroup,FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FooterComponent,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private APIurl="https://localhost:7096/api/Customer/login";
  loginForm!: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false] // Optional field for "Remember Me" functionality
    });
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (this.loginForm.get('email')?.value=="" || this.loginForm.get('password')?.value==""){
      this.loginForm.markAllAsTouched();
    }

    else {
      this.http.post<any>(this.APIurl, { email, password }).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          const loginID = response.data.id;
          localStorage.setItem('loginID', loginID);
          if(!response.data.isAdmin){
          this.router.navigate(['/products']);
          }else
          this.router.navigate(['/admin/productlist'], );

        },
        error: (error) => {
          console.error('Login failed', error);
          this.loginForm.get('email')?.setErrors({ invalidlogin: true });
        }
      });
    }

  }
}



