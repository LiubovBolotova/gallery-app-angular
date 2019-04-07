import { MainPageComponent } from './main-page/main-page.component';
import { Routes } from '@angular/router';
import { DetailsPageComponent } from './details-page/details-page.component';

export const routes: Routes = [
  {
    path: 'main',
    component: MainPageComponent,
  },

  {
    path: 'main/: page',
    component: MainPageComponent,
  },

  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },

  {
    path: 'details/:artObjectNumber',
    component: DetailsPageComponent,
  },
];
