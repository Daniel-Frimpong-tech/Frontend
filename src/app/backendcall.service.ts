
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendcallService {
  selectedData: any ;
  retrievedData:any;

  retrieveData(data: any){
    this.retrievedData = data;
    console.log(this.retrievedData);
  }


 getSelectedData(index:any){
  this.selectedData = this.retrievedData[index];
  return this.selectedData;
 }


  async postData(data: any){
    console.log(data);
    const obj = {
      InputCity: data.InputCity,
      InputState: data.InputState,
      tomorrowErrorMg: data.tomorrowErrorMg,
      overralWeatherData: data.overralWeatherData,
      weatherData: data.weatherData,
      hourlyWeatherData: data.hourlyWeatherData,
      icon: data.icon,
      icontext: data.icontext,
      weekDetails: data.weekDetails,
      selectedDayDetails: data.selectedDayDetails,
      selectedDayStatus: data.selectedDayStatus,
      location: data.location,
    };
  
    console.log(obj);
    const myHeaders = new Headers();
    const sending = JSON.stringify(obj);
    console.log(sending);
    myHeaders.append('Content-Type', 'application/json');
      const response = await fetch('https://daniel-project-3.azurewebsites.net/api/db', {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: sending,
      }).then(response => response.json());
        console.log(response);
  }

  async deleteData(id: any){
    this.selectedData = this.retrievedData[id];
    console.log(this.selectedData);
    console.log(this.selectedData._id);
    const selectedid = this.selectedData._id;
    try {
      const response = await fetch(`https://daniel-project-3.azurewebsites.net/api/delete/${selectedid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log('Success:', JSON.stringify(result));
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getData(){
    const call = await fetch('https://daniel-project-3.azurewebsites.net/api/db')
    const data = await call.json();
    console.log(data);
    this.retrieveData(data);
  }

  constructor() { }
}
