import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TomorrowioService {

  constructor() { }

  getWeather(location: string): Promise<any>{
    var weather = fetch(`https://daniel-project-3.azurewebsites.net/api/weather?location=${location}`).then(response => response.json());
    console.log(weather);
    
    return weather;
  }
}
