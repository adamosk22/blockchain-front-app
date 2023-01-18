import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Result } from './app.interfaces'


const headers= new HttpHeaders()
  .set('X-Auth-Token', '6e2dd71288864bff83969e72369eb2bb')
  .set('Access-Control-Allow-Origin', '*')
  .set('Access-Control-Allow-Methods', 'GET')
  .set('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization');

@Injectable({providedIn:'root'})
export class AppService {
  constructor(private http: HttpClient) { }
  baseUrl = "https://cors-anywhere.herokuapp.com/https://api.football-data.org/"

  getMatches(): Observable<Result>{
    return this.http.get<Result>(this.baseUrl + 'v4/competitions/2021/matches?status=SCHEDULED', { 'headers': headers })
  }

}