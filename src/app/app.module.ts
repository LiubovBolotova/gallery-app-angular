import { ArtObjectService } from './art-object.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './routes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [AppComponent, MainPageComponent, DetailsPageComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [ArtObjectService],
  bootstrap: [AppComponent],
})
export class AppModule {}
