
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

 deleteSelected (){
  this.selectedData = {
    id: '',
    data: '',
  };
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
      const response = await fetch('http://localhost:3000/api/db', {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: sending,
      }).then(response => response.json());
        console.log(response);
  }

  async deleteData(id: any){

    const selectedid = this.selectedData.id;
    try {
      const response = await fetch(`http://localhost:3000/api/delete?id=${selectedid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log('Success:', JSON.stringify(result));
      this.deleteSelected();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getData(){
    const call = await fetch('http://localhost:3000/api/db')
    const data = await call.json();
    console.log(data);
    this.retrieveData(data);
  }

  constructor() { }
}
