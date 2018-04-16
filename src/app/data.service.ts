import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class DataService {

  private dataUrl = 'http://localhost:5000/';

  constructor(
    private http: HttpClient
  ) {}

  getData(): Observable<object> {
  return this.http.get(this.dataUrl)
  }

}
