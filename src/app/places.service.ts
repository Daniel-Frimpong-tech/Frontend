import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  getPlaces(input:string): Promise<any>{
    var call = fetch(`http://localhost:3000/api/places?input=${input}`).then(response => response.json());
    console.log(call);
    return call;
  }
}
