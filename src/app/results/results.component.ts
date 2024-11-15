import { map } from 'rxjs/operators';

import{animate, state, style, transition, trigger} from '@angular/animations';
import{GoogleMapsModule} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Component,ChangeDetectorRef, ElementRef, Renderer2, ViewChild, OnInit} from '@angular/core';
import { GlobalStateManagerService } from '../global-state-manager.service';
import { BackendcallService } from '../backendcall.service';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_boost from 'highcharts/modules/boost';
import HC_patternFill from 'highcharts/modules/pattern-fill';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_windbarb from 'highcharts/modules/windbarb';

HC_windbarb(Highcharts);
HC_more(Highcharts);
HC_exporting(Highcharts);
HC_boost(Highcharts);
HC_patternFill(Highcharts);
HC_accessibility(Highcharts);



@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
  animations:[
    trigger('SlideIn',[
      transition(':enter',[
        style({
          transform: 'translateX(100%)',
        }),
        animate('500ms ease-out', style({
          transform: 'translateX(0)'
        })),
      ]),
      transition(":leave",[
        animate('500ms ease-out', style({
          transform: 'translateX(-100%'
        }))
      ])
    ])
  ]
})
export class ResultsComponent{
  
  @ViewChild('noData') noData!: ElementRef;
  @ViewChild('progress') progress!: ElementRef;
  @ViewChild('mainResult') mainResult!: ElementRef;
  @ViewChild('resultData') resultData!: ElementRef;
  @ViewChild('Title') Title!: ElementRef;
  @ViewChild('hideTitle') hideTitle!: ElementRef;
  @ViewChild('tableData') tableData!: ElementRef;
  @ViewChild('graphOne') graphone!: ElementRef;
  @ViewChild('graphTwo') graphtwo!: ElementRef;
  @ViewChild('details') details!: ElementRef;
  @ViewChild('starButton') starButton!: ElementRef;
  @ViewChild('star') star!: ElementRef;
  @ViewChild('googleMap', {static: false}) g!: ElementRef;

  options !: google.maps.MapOptions;
  mark : any;


  weeklyData: any[] = [];
  intableData: any[] = [];
  favourite: any[] = [];

  showDayDetails: boolean = false;



status !: any;
maxTemp !: any;
minTemp !: any;
appTemp !: any;
humidity !: any;
windSpeed !: any;
sunRise !: any;
sunSet !: any;
visibility !: any;
cloudCover !: any;
date !: any;



constructor(
  private globalState: GlobalStateManagerService,
  private renderer: Renderer2,
  private cd: ChangeDetectorRef,
  private backend: BackendcallService
){}

displayState: any;
displayCity: any;



display(){
  setTimeout(()=>{
    this.progress.nativeElement.innerHTML = `<div class="progress mt-5" style="width: 70%"  >
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%"></div>
                </div>`
  
  setTimeout(()=>
  {
    if(this.globalState.getState('weatherData').length === 0){
      this.renderer.removeAttribute(this.noData.nativeElement, 'hidden');
      this.renderer.setAttribute(this.mainResult.nativeElement, 'hidden', 'true');
      return;
    }else{
      this.displayContent();
    }
    
  }, 1000);
  }, 200);
  

  }; 

  

displayContent(){
  this.renderer.removeAttribute(this.resultData.nativeElement,'hidden');
  this.renderer.removeAttribute(this.starButton.nativeElement,'hidden');
  this.renderer.setAttribute(this.progress.nativeElement,'hidden','true');
  this.progress.nativeElement.innerHTML = '';
  setTimeout(()=>{
    this.displayState =  this.globalState.getState('InputState').toString();
    this.displayCity = this.globalState.getState('InputCity').toString();
    this.Title.nativeElement.textContent = `Forecast at ${this.displayCity}, ${this.displayState}`;
    console.log(this.Title.nativeElement.value);
    this.renderer.removeAttribute(this.resultData.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.hideTitle.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.Title.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.starButton.nativeElement, 'hidden');
    this.insertData();
    this.graphOne();
    this.graphTwo();
  },2000);
    
  };


  trackItem(index: number, item: any){
    return item[index];
  }
  
  
 
insertFavorite(){
  setTimeout(()=>{
    const data = this.backend.retrievedData;
    this.favourite = data.map((item: any, index: number) => {
      const city = item.InputCity;
      const state = item.InputState;
    });
  },2000);
}

 insertData(){
    setTimeout(()=>{
      this.weeklyData = this.globalState.getState('weatherData');
      this.intableData = this.weeklyData.map((data, index) => {
        const date = new Date(data.startTime).toLocaleString('default', {weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        this.cd.detectChanges();
        const minTemp = data.values.temperatureMin;
        const maxTemp = data.values.temperatureMax;
        const windSpeed = data.values.windSpeed;
        this.weatherDisplayIcon(data.values.weatherCode);
        const icon = this.globalState.getState('icon');
        const iconText = this.globalState.getState('icontext');
        console.log(iconText);
        console.log(icon);
        console.log(data.values);
        this.globalState.pushState('weekDetails', data.values);
        this.globalState.pushState('selectedDayStatus', iconText);
        
        return {index,date, minTemp, maxTemp, windSpeed, icon, iconText};
      });
    },200);
  };

 async dayDetails(index: number){
  this.renderer.removeAttribute(this.details.nativeElement, 'hidden');
   this.renderer.setAttribute(this.resultData.nativeElement, 'hidden','true');
    this.renderer.setAttribute(this.starButton.nativeElement, 'hidden', 'true');
   this.renderer.setAttribute(this.hideTitle.nativeElement, 'hidden', 'true');
   this.renderer.setAttribute(this.Title.nativeElement, 'hidden', 'true');
    this.globalState.setState(
      'selectedDayDetails',
    this.globalState.getState('weekDetails')[index]);
    let dayDetails = this.globalState.getState('selectedDayDetails');
    console.log(dayDetails);
    this.status = this.globalState.getState('selectedDayStatus')[index];
    this.maxTemp = dayDetails.temperatureMax;
    this.minTemp = dayDetails.temperatureMin;
    this.appTemp = dayDetails.temperatureApparent;
    this.humidity = dayDetails.humidity;
    this.windSpeed = dayDetails.windSpeed;
    this.sunRise = new Date(dayDetails.sunriseTime).toLocaleTimeString(
      'default',
      {hour: 'numeric'}
    );
    this.sunSet = new Date(dayDetails.sunsetTime).toLocaleTimeString(
      'default',
      {hour: 'numeric'}
    );
    this.visibility = dayDetails.visibility;
    this.cloudCover = dayDetails.cloudCover; 
    this.date = new Date(dayDetails.sunriseTime).toLocaleString('default', {weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
    });

    const [lat,lon] = this.globalState.getState('location').split(',').map(Number);
    console.log(lat);
    console.log(lon);
  
 
      this.options = {
        center: {lat: lat,lng: lon},
        zoom: 15,
      }
      this.mark ={
        lat: lat,
        lng: lon,
      }
      
      const map = new google.maps.Map(this.g.nativeElement, this.options);
      new google.maps.Marker({
        position: this.mark,
        map,
      })
  }


  post(){
    const text = `The temperature in ${this.globalState.getState('InputCity')}, ${this.globalState.getState('InputState')} on ${this.date} is ${this.appTemp}°F. and the conditions are ${this.status}.`;
    const url = `https://twitter.com/intent/tweet?text=${text},&hashtags=CSCI571WeatherForecast`;
    window.open(url, '_blank');
  }
  fav: boolean = false;

  async pushData(){
    if(this.fav===false){
      const data = this.globalState.getFullState();
      console.log(data);
      await this.backend.postData(data);
      this.fav = true;
      this.renderer.setAttribute(this.star.nativeElement, 'fill', 'yellow');
      this.getData();
    }else{
      this.fav = false;
      this.renderer.setAttribute(this.star.nativeElement, 'fill', '#DDDCC8');
    }
  }

  async getData(){
    const data = await this.backend.getData();
    console.log(data);
  }

  clearData(){
    this.weeklyData = [];
    this.intableData = [];
    this.globalState.setState('weatherData', []);
    this.globalState.setState('weekDetails', []);
    this.globalState.setState('selectedDayDetails', []);
    this.globalState.setState('selectedDayStatus', []);
    this.globalState.setState('icon', '');
    this.globalState.setState('icontext', '');
  }

  previous(){
    this.date ='';
    this.status = '';
    this.maxTemp = '';
    this.minTemp = '';
    this.appTemp = '';
    this.humidity = '';
    this.windSpeed = '';
    this.sunRise = '';
    this.sunSet = '';
    this.visibility = '';
    this.cloudCover = '';
    this.renderer.setAttribute(this.details.nativeElement, 'hidden', 'true');
    this.renderer.removeAttribute(this.resultData.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.hideTitle.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.Title.nativeElement, 'hidden');
    this.renderer.removeAttribute(this.starButton.nativeElement, 'hidden');
  };

      weatherDisplayIcon(weatherCode: number){
        let weatherIcon;
        let weatherIconText;

        if (weatherCode == 1000){
          weatherIcon = 'clear_day.svg';
            weatherIconText = 'Clear';
        }else if (weatherCode == 1001){
          weatherIcon = 'cloudy.svg';
            weatherIconText = 'Cloudy';
        }else if (weatherCode == 1100){
          weatherIcon = 'mostly_clear_day.svg';
            weatherIconText = 'Mostly Clear';
        }else if(weatherCode == 1101){
          weatherIcon = 'partly_cloudy_day.svg';
            weatherIconText = 'Partly Cloudy';
        }else if(weatherCode == 1102){
          weatherIcon = 'mostly_cloudy.svg';
            weatherIconText = 'Mostly Cloudy';
        }else if(weatherCode == 2000){
          weatherIcon = 'fog.svg';
            weatherIconText = 'Fog';
        }else if(weatherCode == 2100){
          weatherIcon = 'fog_light.svg';
            weatherIconText = 'Light Fog';
        }else if(weatherCode == 4000){
          weatherIcon = 'drizzle.svg';
            weatherIconText = 'Drizzle Rain';
        }else if(weatherCode == 4001){
          weatherIcon = 'rain.svg';
            weatherIconText = 'Rain';
        }else if(weatherCode == 4200){
          weatherIcon = 'rain_light.svg';
            weatherIconText = 'Light Rain';
        }else if(weatherCode == 4201){
          weatherIcon = 'rain_heavy.svg';
            weatherIconText = 'Heavy Rain';
        }else if(weatherCode == 5000){
          weatherIcon = 'snow.svg';
            weatherIconText = 'Snow';
        }else if(weatherCode == 5001){
          weatherIcon = 'flurries.svg';
            weatherIconText = 'Flurries';
        }else if(weatherCode == 5100){
          weatherIcon = 'snow_light.svg';
            weatherIconText = 'Light Snow';
        }else if(weatherCode == 5101){
          weatherIcon = 'snow_heavy.svg';
            weatherIconText = 'Heavy Snow';
        }else if(weatherCode == 6000){
          weatherIcon = 'freezing_drizzle.svg';
            weatherIconText = 'Freezing Drizzle';
        }else if(weatherCode == 6001){
          weatherIcon = 'freezing_rain.svg';
            weatherIconText = 'Freezing Rain';
        }else if(weatherCode == 6200){
          weatherIcon = 'freezing_drizzle_light.svg';
            weatherIconText = 'Light Freezing Drizzle';
        }else if(weatherCode == 6201){
          weatherIcon = 'freezing_rain_heavy.svg';
            weatherIconText = 'Heavy Freezing Rain';
        }else if(weatherCode == 7000){
          weatherIcon = 'ice_pellets.svg';
            weatherIconText = 'Ice Pellets';
        }else if(weatherCode == 7101){
          weatherIcon = 'ice_pellets_heavy.svg';
            weatherIconText = 'Heavy Ice Pellets';
        }else if(weatherCode == 7102){
          weatherIcon = 'ice_pellets_light.svg';
            weatherIconText = 'Light Ice Pellets';
        }else if(weatherCode == 8000){
          weatherIcon = 'tstorm.svg';
            weatherIconText = 'Thunderstorm';
        }

        this.globalState.setState('icon',weatherIcon);
        this.globalState.setState('icontext', weatherIconText);
      
    }


graphOne(){
    const data = this.globalState.getState('weatherData').map((item:any) => {   
      return [new Date(item.startTime).getTime(), item.values.temperatureMin, item.values.temperatureMax];
  });
  setTimeout(()=>{
    Highcharts.chart(this.graphone.nativeElement, <Highcharts.Options>{
      chart: {
          type: 'arearange',
          zooming: {
              type: 'x'
          },
          scrollablePlotArea: {
              minWidth: 600,
              scrollPositionX: 1
          }
      },
      title: {
          text: 'Temperature variation by day'
      },
      xAxis: {
          type: 'datetime',
          accessibility: {
              rangeDescription: '#'
          }
      },
      yAxis: {
          title: {
              text: null
          }
      },
      tooltip: {
          crosshairs: true,
          shared: true,
          valueSuffix: '°F',
          xDateFormat: '%A, %b %e'
      },
      legend: {
          enabled: false
      },
      series: [{
          type: 'arearange',
          name: 'Temperatures',
          data: data,
          color: {
              linearGradient: {
                  x1: 0,
                  x2: 0,
                  y1: 0,
                  y2: 1
              },
              stops: [
                  [0, '#f7a35c'],
                  [1, '#aaeeee']
              ]
          }
      }]
  });
  }, 2000);        
  }

graphTwo(){
    setTimeout(()=>{
      class Meteogram {
        // Chart data arrays
        symbols: any[] = [];
        precipitations: any[] = [];
        precipitationsError: any[] = [];
        winds: any[] = [];
        temperatures: any[] = [];
        pressures: any[] = [];
        humidity: any[] = [];
        chart: any;
        container: any;
        json: any;
        humidityError: any;
        resolution: number = 3600000;
      
        // Initialize
        constructor(container: any, json: any) {
          this.container = container;
          this.json = json;
      
          // Process the data after initializing
          this.parseYrData();
        }
      
        // Draw wind arrows and blocks
        drawBlocksForWindArrows(chart: any) {
          const xAxis = chart.xAxis[0];
      
          for (let pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {
            const isLast = pos === max + 36e5,
              x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
            const isLong = this.resolution > 36e5 ? pos % this.resolution === 0 : i % 2 === 0;
      
            chart.renderer
              .path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28), 'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
              .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1,
              })
              .add();
          }
      
          chart.get('windbarbs').markerGroup.attr({
            translateX: chart.get('windbarbs').markerGroup.translateX + 8,
          });
        }
      
        // Chart options
        getChartOptions(): Highcharts.Options {
          return {
            chart: {
              renderTo: this.container,
              marginBottom: 70,
              marginRight: 40,
              marginTop: 50,
              plotBorderWidth: 1,
              height: 310,
              alignTicks: false,
              scrollablePlotArea: {
                minWidth: 720,
              },
            },
            defs: <Highcharts.DefsOptions>{
              patterns: [
                {
                  id: 'humidity-error',
                  path: {
                    d: ['M', 3.3, 0, 'L', -6.7, 10, 'M', 6.7, 0, 'L', -3.3, 10, 'M', 10, 0, 'L', 0, 10, 'M', 13.3, 0, 'L', 3.3, 10, 'M', 16.7, 0, 'L', 6.7, 10].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1,
                  },
                },
              ],
            },
            title: {
              text: 'Hourly Weather (For Next 5 Days)',
              align: 'center',
              style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              },
            },
            xAxis: [
              {
                type: 'datetime',
                tickInterval: 2 * 36e5,
                minorTickInterval: 36e5,
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: { 
                  format: '{value:%H}' 
                },
                crosshair: true,
              },
              {
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                  format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                  align: 'left',
                  x: 3,
                  y: 8,
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1,
              },
            ],
            yAxis: [
              {
                title: { 
                  text: null 
                },
                labels: { 
                  format: '{value}°', 
                  style: { 
                    fontSize: '10px' 
                  }, 
                  x: -3 
                },
                plotLines: [
                  { 
                    value: 0, 
                    color: '#BBBBBB', 
                    width: 1, 
                    zIndex: 2 
                  }
                ],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
              },
              {
                title: { 
                  text: null 
                },
                labels: { 
                  enabled: false 
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0,
              },
              {
                allowDecimals: false,
                title: { 
                  text: 'inHg', 
                  offset: 0, 
                  align: 'high', 
                  rotation: 0, 
                  style: { 
                    fontSize: '10px', 
                    color: 'orange' 
                  }, 
                  textAlign: 'left', 
                  x: 3 
                },
                labels: { 
                  style: { 
                    fontSize: '8px', 
                    color: 'orange' 
                  }, 
                  y: 2, 
                  x: 3 
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false,
              },
            ],
            series: [
              {
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.y}°F</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            },{
                name: 'humidity',
                data: this.humidityError,
                type: 'column',
                color: 'url(#humidity-error)',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                tooltip: {
                    valueSuffix: ' %',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.minvalue} % - ' +
                        '{point.maxvalue} %</b><br/>'
                },
                grouping: false,
                dataLabels: {
                    enabled: this.humidityError,
                    filter: {
                        operator: '>',
                        property: 'maxValue',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: 'gray'
                    }
                }
            },
              {
                name: 'humidity',
                data: this.humidity,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: !this.humidityError,
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: '#666'
                    }
                },
                tooltip: {
                    valueSuffix: ' %'
                }},
              {
                name: 'Air pressure',
                color: 'orange',
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' inHg'
                },
                dashStyle: 'ShortDot',
                yAxis: 2,
                type: 'spline',
            },
              { 
                name: 'Wind', 
                type: 'windbarb', 
                id: 'windbarbs', 
                color: 'blue', 
                lineWidth: 1.5, 
                data: this.winds, 
                vectorLength: 18, 
                yOffset: -15 
              },
            ],
          };
        }
      
        // Load chart
        onChartLoad(chart: any) {
          this.drawBlocksForWindArrows(chart);
        }
      
        // Create the chart
        createChart() {
          this.chart = new Highcharts.Chart(this.getChartOptions(), (chart: any) => {
            this.onChartLoad(chart);
          });
        }
      
        // Error handling
        error() {
          const loadingElement = document.getElementById('loading');
          if (loadingElement) {
            loadingElement.innerHTML = '<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
          }
        }
      
        // Parse JSON data
        parseYrData() {
          if (!Array.isArray(this.json)) {
            console.error('expected JSON to be an array, got', this.json);
            return this.error();
          }
      
          let pointStart: number | undefined;
      
          this.json.forEach((node: any, i: number) => {
            const x = Date.parse(node.startTime),
              to = Date.parse(node.endTime);
      
            this.symbols.push('someIconText'); // Replace with actual symbol
      
            this.temperatures.push({
              x,
              y: Math.round(node.values.temperature),
              to,
            });
      
            this.humidity.push({
              x,
              y: Math.round(node.values.humidity),
            });
      
            if (i % 2 === 0) {
              this.winds.push({
                x,
                value: node.values.windSpeed,
                direction: node.values.windDirection,
              });
            }
      
            this.pressures.push({
              x,
              y: Math.round(node.values.pressureSeaLevel),
            });
      
            if (i === 0) {
              pointStart = (x + to) / 2;
            }
          });
      
          this.createChart();
        }
      }
      
      // Instantiate
      window.meteogram = new Meteogram(this.graphtwo.nativeElement, this.globalState.getState('hourlyWeatherData'));
    }, 1000);
    
  }

  
  
}
