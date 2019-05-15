import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ArtObjectService } from '../art-object.service';
import { catchError, filter } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  public currentPage: number;
  public query = new FormGroup({
    keyword: new FormControl(''),
  });
  public artObjects = [];
  public isPopupShown: boolean = false;
  public pages: number[] = [];
  public orderBy: string;
  public perPage: number;
  public artObject: {} = {};
  public artObjectNumber: number = this.artObjects.indexOf(this.artObject);
  public countOfPages: number;
  public noResultsIsShown = false;

  private _sub;

  constructor(
    private _artObjectService: ArtObjectService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    this._sub = this._route.queryParams.subscribe((params) => {
      this.currentPage = params.page ? +params.page : 1;
      this.orderBy = params.orderBy ? params.orderBy : '';
      this.perPage = params.perPage ? +params.perPage : 10;
      this.query.patchValue({ keyword: params.query });

      this.searchByParams(this.currentPage, this.perPage || 10, params.orderBy, params.query || '');
    });
  }

  public searchByParams(page?: number, perPage?: number, orderBy?: string, query?): void {
    this._artObjectService
      .getList$(query, perPage, page, orderBy)
      .pipe(
        catchError((err) => {
          console.log('caught mapping error and rethrowing', err);
          return throwError(err);
        }),
      )
      .subscribe((data: any) => {
        if (data) {
          this.artObjects = data.artObjects.filter((artObject) => artObject.headerImage.url);
          this.pages = [];

          this.countOfPages = Math.ceil(
            data.countFacets.ondisplay && data.countFacets.ondisplay >= 20
              ? data.countFacets.ondisplay / (perPage || 10)
              : data.countFacets.hasimage >= 10
              ? data.countFacets.hasimage / (perPage || 10)
              : data.countFacets.hasimage,
          );

          for (let i = 1; i <= this.countOfPages; i++) {
            this.pages.push(i);
          }
          this.currentPage > 3 || this.currentPage === this.countOfPages - 3
            ? this.pages.splice(0, this.currentPage - 2)
            : (this.pages = this.pages);
        }
        if (!data.count) {
          this.noResultsIsShown = true;
        }
        (err: any) => console.log(err);
      });
  }

  public orderByParam(orderByParam: string): void {
    this._router.navigate(['/main'], {
      queryParams: { orderBy: orderByParam },
      queryParamsHandling: 'merge',
    });
  }

  public searchByQuery() {
    this._router.navigate(['/main'], {
      queryParams: { query: this.query.value.keyword },
      queryParamsHandling: 'merge',
    });
  }

  public showArtObjectPopup(artObject): void {
    this.isPopupShown = true;
    this._router.navigate(['main'], {
      queryParams: {
        artObjectNumber: artObject.objectNumber,
        page: this.currentPage,
        query: this.query.value.keyword || '',
        orderBy: this.orderBy || '',
        perPage: this.perPage || 10,
      },
    });
  }

  public closePopup(): void {
    this.isPopupShown = false;
    this._router.navigate(['main'], {
      queryParams: {
        page: this.currentPage,
        query: this.query.value.keyword || '',
        orderBy: this.orderBy || '',
        perPage: this.perPage || 10,
      },
    });
  }

  public prevPage(): void {
    this.currentPage >= 1 ? this.currentPage-- : (this.currentPage = 1);
    this._router.navigate(['/main'], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  public nextPage(): void {
    this.currentPage !== this.countOfPages
      ? this.currentPage++
      : (this.currentPage = this.countOfPages);
    this._router.navigate(['/main'], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
