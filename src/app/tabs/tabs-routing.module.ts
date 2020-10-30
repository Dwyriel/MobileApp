import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'userForm',
        loadChildren: () => import('../pags/user-form/user-form.module').then(m => m.UserFormPageModule)
      },
      {
        path: 'userForm/:id',//maybe remove this
        loadChildren: () => import('../pags/user-form/user-form.module').then(m => m.UserFormPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../pags/user-list/user-list.module').then(m => m.UserListPageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../pags/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
      },
      {
        path: 'user/:id',
        loadChildren: () => import('../pags/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
      },
      {
        path: 'addressForm',
        loadChildren: () => import('../pags/address-form/address-form.module').then( m => m.AddressFormPageModule)
      },
      {
        path: 'addressForm/:id',
        loadChildren: () => import('../pags/address-form/address-form.module').then( m => m.AddressFormPageModule)
      },
      {
        path: 'productForm',
        loadChildren: () => import('../pags/product-form/product-form.module').then(m => m.ProductFormPageModule)
      },
      {
        path: 'productForm/:id',
        loadChildren: () => import('../pags/product-form/product-form.module').then(m => m.ProductFormPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../pags/product-list/product-list.module').then(m => m.ProductListPageModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../pags/product/product.module').then(m => m.ProductPageModule)
      },
      {
        path: 'product/:id',
        loadChildren: () => import('../pags/product/product.module').then(m => m.ProductPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../pags/maps/maps.module').then( m => m.MapsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
