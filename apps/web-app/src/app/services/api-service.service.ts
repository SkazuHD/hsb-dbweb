import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) {
    http.get('http://127.0.0.1:4201/api').subscribe((data) => {
      console.log(data);
    });
  }
}
