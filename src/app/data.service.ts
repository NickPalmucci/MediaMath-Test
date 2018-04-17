import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class DataService {

  private baseUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient
  ) {}

  getData(route: string): any {
  return this.http.get(this.baseUrl + route);
  }

}
