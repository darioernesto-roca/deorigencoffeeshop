import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(({ HomeComponent }) => HomeComponent), title: 'De Origen Coffee Shop' },
  { path: 'categories', loadComponent: () => import('./pages/categories.component').then(({ CategoriesComponent }) => CategoriesComponent), title: 'Menu | De Origen' },
  { path: 'about', loadComponent: () => import('./pages/about.component').then(({ AboutComponent }) => AboutComponent), title: 'Our Story | De Origen' },
  { path: 'about-us', redirectTo: 'about', pathMatch: 'full' },
  { path: 'contact', loadComponent: () => import('./pages/contact.component').then(({ ContactComponent }) => ContactComponent), title: 'Visit Us | De Origen' },
  { path: '**', loadComponent: () => import('./pages/not-found.component').then(({ NotFoundComponent }) => NotFoundComponent), title: 'Page Not Found | De Origen' }
];
