import { Routes } from '@angular/router';
import { ProductslistComponent } from './productslist/productslist.component';
import { LoginComponent } from './login/login.component';
import { ProductspageComponent } from './productspage/productspage.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { sidebarComponent } from './sidebar/sidebar.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'products',component:ProductspageComponent, children: [
    { path: '', component: ProductslistComponent } ] },
    { path: '**', component: PagenotfoundComponent },
    // {path: 'filter', component: sidebarComponent, outlet: 'popup' }
]
