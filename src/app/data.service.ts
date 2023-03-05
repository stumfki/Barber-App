import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface GiphyResponse {
  data: {
    images: {
      fixed_height: {
        url: string;
      }
    }
  }[];

}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = "http://localhost:3000"
  private readonly API_URL = 'http://api.giphy.com/v1/gifs/search';
  private readonly API_KEY = 'KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI';
  private readonly DEFAULT_IMAGE = 'assets/barber.gif';

  constructor(private http: HttpClient) { }

  getServices() {
    return this.http.get<any[]>(`${this.apiUrl}/services`);
  }


  getBarbers() {
    return this.http.get<any[]>(`${this.apiUrl}/barbers`);
  }



  getAppointments() {
    return  this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  postData(data: any) {
    return this.http.post(`${this.apiUrl}/appointments`, data);
  }

  getGifImage(): Observable<string> {
    return this.http.get<GiphyResponse>(`${this.API_URL}?api_key=${this.API_KEY}&q=barber`).pipe(
      map(response => response.data[this.getRandomNumber()].images.fixed_height.url),
      catchError(() => of(this.DEFAULT_IMAGE))
    );
  }

  private getRandomNumber(): number {
    return Math.floor(Math.random() * 50);
  }
}

