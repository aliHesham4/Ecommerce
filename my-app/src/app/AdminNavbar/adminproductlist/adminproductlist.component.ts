import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminproductlist',
  imports: [RouterModule, FormsModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css'
})
export class AdminproductlistComponent {
  select=false;
  searchText: string = ''; 
}
