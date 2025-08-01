import { Routes } from '@angular/router';
import { ProductslistComponent } from './productslist/productslist.component';
import { LoginComponent } from './login/login.component';
import { ProductspageComponent } from './productspage/productspage.component';
import { PagenotfoundComponent } from './Done/pagenotfound/pagenotfound.component';
import { FilterpopupComponent } from './Done/filterpopup/filterpopup.component';
import { SearchpopupComponent } from './searchpopup/searchpopup.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'products',component:ProductspageComponent, children: [
    { path: '', component: 
        ProductslistComponent, children: [
          { path: 'filter', component: FilterpopupComponent, outlet: 'popup' },
          {path: 'search', component: SearchpopupComponent, outlet: 'popup'}
        ]
     }
     ]
     },
    { path: '**', component: PagenotfoundComponent },
     
]
