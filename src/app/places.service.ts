
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  getPlaces(input:string): Promise<any>{
    var call = fetch(`${environment.API_BASE_URL}/api/places?input=${input}`).then(response => response.json());
    console.log(call);
    return call;
  }
}
