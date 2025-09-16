import { Routes } from '@angular/router';
import { ProductslistComponent } from './productslist/productslist.component';
import { LoginComponent } from './login/login.component';
import { ProductspageComponent } from './productspage/productspage.component';
import { PagenotfoundComponent } from './Done/pagenotfound/pagenotfound.component';
import { FilterpopupComponent } from './Done/filterpopup/filterpopup.component';
import { SearchpopupComponent } from './Done/searchpopup/searchpopup.component';
import { RegisterComponent } from './register/register.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { AdminLayoutComponent } from './AdminNavbar/adminlayout/adminlayout.component';
import { AdminproductlistComponent } from './AdminNavbar/adminproductlist/adminproductlist.component';
import { DashboardComponent } from './AdminNavbar/dashboard/dashboard.component';
import { AddproductComponent } from './AdminNavbar/addproduct/addproduct.component';
import { EditproductComponent } from './AdminNavbar/editproduct/editproduct.component';
import { CartComponent } from './cart/cart.component';
import { MyordersComponent } from './myorders/myorders.component';
import { AuthGuard } from './auth.guard';
import { AdminguardService } from './adminguard.service';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {
  path: 'products',
  component: ProductspageComponent,
  canActivate: [AuthGuard],
  children: [
    { path: '', component: ProductslistComponent }, 
    { path: 'filter', component: FilterpopupComponent, outlet: 'popup' },
    { path: 'search', component: SearchpopupComponent, outlet: 'popup' }
  ]
},
     {path: 'register',component: RegisterComponent},
     {path: 'product/:id',canActivate: [AuthGuard], component: ProductdetailComponent},
     {path: 'myOrders',canActivate: [AuthGuard],component:MyordersComponent},
     {path:'products/cart',canActivate: [AuthGuard],component: CartComponent },
     {path: 'admin',canActivate: [AdminguardService],component: AdminLayoutComponent,children: [
    { path: '', redirectTo: 'productlist', pathMatch: 'full' }, // ✅ Default child
    { path: 'productlist', component: AdminproductlistComponent},
    {path:'productlist/add-product',component: AddproductComponent},
    {path:'productlist/edit-product/:id',component: EditproductComponent},
    { path: 'dashboard', component: DashboardComponent }]},


    { path: '**', component: PagenotfoundComponent },
     
]
