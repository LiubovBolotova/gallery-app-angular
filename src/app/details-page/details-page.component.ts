import { ArtObjectService } from './../art-object.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
  pluck,
  switchMap
} from "rxjs/operators";

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  public objectNumber: string;
  public artObject;
  public tags: [] = [];
  public maker: string;
  public page: number;
  public userQuery = {};

  constructor(private artObjectService: ArtObjectService,
    private route: ActivatedRoute,
    private _router: Router, ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        pluck('artObjectNumber'),
        switchMap((artObjectNumber: string) => this.artObjectService
          .getOne$(artObjectNumber)),
      )
      .subscribe((data) => {
        if (data) {
          this.artObject = data;
          this.maker = this.artObject.artObject.principalMakers[0].name;
        }
      });
    this.page = +JSON.parse(localStorage.getItem('userQuery')).page;
  }

  public goToWorks(): void {
    this.userQuery = {
      page: 1,
      query: this.maker,
      perPage: 10
    };
    localStorage.setItem('userQuery', JSON.stringify(this.userQuery));
    this._router.navigate(['/page', 1]);
  }
}
