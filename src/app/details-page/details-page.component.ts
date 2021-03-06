import { ArtObjectService } from './../art-object.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
})
export class DetailsPageComponent implements OnInit, OnDestroy {
  public objectNumber: string;
  public artObject;
  public tags: [] = [];
  public maker: string;
  public page: number;
  public perPage: number;
  public orderBy: string;
  public query: string;

  private _sub;

  constructor(private _artObjectService: ArtObjectService, private _route: ActivatedRoute) {}

  public ngOnInit() {
    this._sub = this._route.queryParams.subscribe((params) => {
      this.objectNumber = params.artObjectNumber;
      this.page = +params.page;
      this.perPage = +params.perPage;
      this.orderBy = params.orderBy;
      this.query = params.query;
    });

    this._artObjectService.getOne$(this.objectNumber).subscribe((data) => {
      if (data) {
        this.artObject = data;
        this.maker = this.artObject.artObject.principalMakers[0].name;
      }
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
