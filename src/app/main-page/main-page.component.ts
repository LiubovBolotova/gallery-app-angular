import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ArtObjectService } from '../art-object.service';
import { catchError, filter, debounceTime } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  public currentPage: number;
  public query = new FormControl('');
  public artObjects = [];
  public numberArtObjectInPopup;
  public isPopupShown: boolean = false;
  public pages: number[] = [];
  public orderBy: string;
  public perPage = 10;
  public artObject: {} = {};
  public artObjectNumber: number = this.artObjects.indexOf(this.artObject);
  public description = '';
  public newQuery = '';
  public countOfPages: number;
  public noResultsIsShown = false;

  private sub;

  constructor(
    private artObjectService: ArtObjectService,
    private _router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParams
      .pipe(filter((params) => params.artist))
      .subscribe((params) => {
        this.newQuery = params.artist || '';
        this.search();
      });
    this.search(1);
  }

  public search(page?: number, perPage?: number, orderByParam?: string) {
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
          this.artObjects = data.artObjects.filter((artObject) => artObject.headerImage.url);
          this.currentPage = page || 1;
          this.pages = [];
          perPage ? (this.perPage = perPage) : (this.perPage = this.perPage);
          this.orderBy = orderByParam || '';
          this.countOfPages =
            Math.ceil(
              data.countFacets.ondisplay
                ? data.countFacets.ondisplay / (this.perPage || 10)
                : data.countFacets.hasimage / (this.perPage || 10),
            ) || 1;

          localStorage.setItem('page', JSON.stringify(this.currentPage));

          for (let i = 1; i <= this.countOfPages; i++) {
            this.pages.push(i);
          }

          this.pages.splice(0, this.currentPage - 2);

          if (this.pages.length > 6 && this.currentPage !== this.countOfPages) {
            this.pages = this.pages.filter(
              (page) => page <= this.currentPage + 2 || page >= this.countOfPages - 2,
            );
          }
        }
        if (!data.count) {
          this.noResultsIsShown = true;
        }
        (err: any) => console.log(err);
      });
  }

  public orderByParam(orderByParam: string): void {
    this.search(this.currentPage, this.perPage, orderByParam);
  }

  public showArtObjectPopup(artObject): void {
    this._getArtObjectDescription(artObject);
    this.artObject = artObject;
    if (artObject.webImage) {
      this.isPopupShown = true;
    }
  }

  public closePopup(): void {
    this.description = '';
    this.isPopupShown = false;
  }

  public goToDetailsPage(artObjectNumber): void {
    this.currentPage = 0;
    this._router.navigate(['/details', artObjectNumber]);
  }

  public prevPage(): void {
    this.currentPage >= 1 ? this.currentPage-- : (this.currentPage = 1);
    this.search(this.currentPage);
  }

  public nextPage(): void {
    this.currentPage !== this.countOfPages
      ? this.currentPage++
      : (this.currentPage = this.countOfPages);

    this.search(this.currentPage);
  }

  private _getArtObjectDescription(artObject): void {
    this.artObjectService.getOne$(artObject.objectNumber).subscribe((data: any) => {
      if (data) {
        this.description = data.artObject.description;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
