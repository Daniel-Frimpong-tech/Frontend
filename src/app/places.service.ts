import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {}

  getPlaces(input:string): Promise<any>{
    var call = fetch(`https://daniel-project-3.azurewebsites.net/api/places?input=${input}`).then(response => response.json());
    console.log(call);
    return call;
  }
}
