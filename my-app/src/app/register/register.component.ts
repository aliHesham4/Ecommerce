import { Component } from '@angular/core';
import { FooterComponent } from '../Done/footer/footer.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FooterComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 
   constructor(private router: Router) {}
}
