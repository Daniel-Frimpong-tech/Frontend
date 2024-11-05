import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { response } from 'express';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private backendCallUrl ='';

  constructor(private http:HttpClient) {}

  getPlaces(input:string): Promise<any>{
    var call = fetch(`http://localhost:3000/api/places?input=${input}`).then(response => response.json());
    console.log(call);
    return call;
  }
}
