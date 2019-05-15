import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ArtObjectService } from '../../art-object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit, OnDestroy {
  @Output() public popupIsClosed: EventEmitter<void> = new EventEmitter();

  public page: number;
  public perPage: number;
  public orderBy: string;
  public query: string;
  public objectNumber: string;
  public artObject;
  public description = '';

  private _sub;

  constructor(private _artObjectService: ArtObjectService, private _route: ActivatedRoute) {}

  ngOnInit() {
    this.description = '';

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
      }
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
