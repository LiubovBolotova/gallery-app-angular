import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ArtObjectService } from '../art-object.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public currentPage: number;
  public query = new FormControl('');
  public artObjects = [];
  public count: number;
  public numberArtObjectInPopup;
  public isPopupShown: boolean = false;
  public pages: number[] = [];
  public orderBy: string;
  public perPage: number = 10;
  public artObject: {} = {};
  public artObjectNumber: number = this.artObjects.indexOf(this.artObject);
  public description: string;
  public favouriteObjects: number = 0;
  public newQuery: string;

  private userQuery: {} = {};

  constructor(private artObjectService: ArtObjectService, private _router: Router) {}

  ngOnInit() {
    this.search();
  }

  public search(page?: number, perPage?: number, orderByParam?: string) {
    if (page === undefined && localStorage.getItem('userQuery')) {
      this.currentPage = +JSON.parse(localStorage.getItem('userQuery')).page || 1;
      this.newQuery = JSON.parse(localStorage.getItem('userQuery')).query;
    }

    this.artObjectService
      .getList$(
        this.query.value || this.newQuery || '',
        page || this.currentPage || 1,
        perPage || this.perPage || 10,
        orderByParam,
      )
      .pipe(
        catchError((err) => {
          console.log('caught mapping error and rethrowing', err);
          return throwError(err);
        }),
      )
      .subscribe((data: any) => {
        if (data) {
          this.artObjects = data.artObjects;
          this.count = data.count;
          this.currentPage = page || 1;
          this.perPage = perPage;
          this.pages = [];
          this.userQuery = {
            page: this.currentPage,
            query: this.query.value,
            perPage: this.perPage,
          };

          localStorage.setItem('userQuery', JSON.stringify(this.userQuery));
          this.pages.length = 0;
          for (let i = 1; i <= this._getCountOfPages(); i++) {
            this.pages.push(i);
          }

          this.pages.splice(0, this.currentPage - 2);

          if (this.pages.length > 6 && this.currentPage !== this._getCountOfPages()) {
            this.pages = this.pages.filter(
              (page) => page <= this.currentPage + 2 || page >= this._getCountOfPages() - 2,
            );
          }
        }

        (err) => console.log(err);
      });
  }

  public orderByParam(orderByParam: string): void {
    this.search(this.currentPage, this.perPage, orderByParam);
  }

  public showArtObjectPopup(artObject): void {
    this._getArtObjectDescription(artObject);
    this.artObject = artObject;
    this.isPopupShown = true;
  }

  public closePopup(): void {
    this.isPopupShown = false;
    this.description = '';
  }

  public goToDetailsPage(artObjectNumber): void {
    this.currentPage = 0;
    this._router.navigate(['/details', artObjectNumber]);
  }

  public prevPage(): void {
    this.currentPage !== 1 ? this.currentPage-- : (this.currentPage = this._getCountOfPages());
    this.search(this.currentPage);
  }

  public nextPage(): void {
    this.currentPage !== this._getCountOfPages() ? this.currentPage++ : (this.currentPage = 1);

    this.search(this.currentPage);
  }

  private _getArtObjectDescription(artObject): void {
    this.artObjectService.getOne$(artObject.objectNumber).subscribe((data: any) => {
      if (data) {
        this.description = data.artObject.description;
      }
    });
  }

  private _getCountOfPages(): number {
    return Math.ceil(this.count / (this.perPage || 10));
  }
}
