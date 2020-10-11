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
        path: 'user-form',
        loadChildren: () => import('../pags/user-form/user-form.module').then( m => m.UserFormPageModule)
      },
      {
        path: 'user-list',
        loadChildren: () => import('../pags/user-list/user-list.module').then( m => m.UserListPageModule)
      },
      {
        path: 'user-profile/:id',
        loadChildren: () => import('../pags/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
      },
      {
        path: 'product-form',
        loadChildren: () => import('../pags/product-form/product-form.module').then( m => m.ProductFormPageModule)
      },
      {
        path: 'product-list',
        loadChildren: () => import('../pags/product-list/product-list.module').then( m => m.ProductListPageModule)
      },
      {
        path: 'product/:id',
        loadChildren: () => import('../product/product.module').then( m => m.ProductPageModule)
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
export class TabsPageRoutingModule {}
