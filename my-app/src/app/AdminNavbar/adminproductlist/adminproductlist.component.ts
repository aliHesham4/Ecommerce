import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminproductlist',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css'
})
export class AdminproductlistComponent {
  select=false;
  searchText: string = ''; 
  loginID: string | null = null;
  hasError: boolean = false;
  products: any;
  constructor(private http: HttpClient,private route: ActivatedRoute){}
   
  ngOnInit(): void {
    // get loginID from query params using snapshot
    this.loginID = this.route.snapshot.queryParamMap.get('loginID');
    console.log('Admin loginID:', this.loginID);

    if(this.loginID){
      this.http.get(`https://localhost:7096/api/Product/getallproducts/${this.loginID}?pageNumber=1`)
      .subscribe({ next: (data) => {
        this.products = data;
      },error: (err) => {
        console.error('Error fetching products:', err);
        this.hasError = true;
      }
      });
    }
  }

}
