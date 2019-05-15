import { DetailsPageComponent } from './details-page/details-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PopupComponent } from './main-page/popup/popup.component';
import { Routes } from '@angular/router';

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
    path: 'details',
    component: DetailsPageComponent,
  },
];
