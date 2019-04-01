import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ArtObjectService {
  apiKey = 'prr2R2l2';
  baseUrl = 'https://www.rijksmuseum.nl/api/en/collection';

  constructor(private http: HttpClient) {}

  public getList$(query, page, perPage, orderBy) {
    const params = this.getBasicParams()
      .set('q', query)
      .set('p', page)
      .set('ps', perPage)
      .set('s', orderBy);

    return this.http.get(this.baseUrl, { params });
  }

  public getOne$(objectNumber: string) {
    const params = this.getBasicParams();
    return this.http.get(this.baseUrl + '/' + objectNumber, { params });
  }

  private getBasicParams() {
    return new HttpParams().set('key', this.apiKey).set('format', 'json');
  }
}
