import { Routes } from '@angular/router';
import { ProductslistComponent } from './productslist/productslist.component';
import { NavbarComponent } from './navbar/navbar.component';

export const routes: Routes = [
    {path:'',component:NavbarComponent},
    {path:'products/',component:ProductslistComponent},
    {path:'products',redirectTo:'products/'}
];
