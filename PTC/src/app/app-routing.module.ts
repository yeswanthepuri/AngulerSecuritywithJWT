import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from "./product/product-list.component";
import { CategoryListComponent } from './category/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailComponent } from './product/product-detail.component';
import { LoginComponent } from './Security/login.component';
import { AuthGuard } from './Security/auth.guard';

const routes: Routes = [
  {
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessProducts' }

  },
  {
    path: 'productDetail/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessProducts' }
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessCategory' }
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: '**', component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
