import {Component, OnInit,ViewChild,Renderer2,ElementRef} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {from, Observable, of} from 'rxjs';
import {startWith, map, debounceTime, switchMap, catchError} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-autocomplete-test',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './autocomplete-test.component.html',
  styleUrl: './autocomplete-test.component.css'
})
export class AutocompleteComponentTest implements OnInit {
  @ViewChild('City') City!: ElementRef;
  


  constructor(
    private renderer: Renderer2,
    private placesService: PlacesService,
  ) {}

 states :{[key: string]:string} = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
  };

  control = new FormControl('');
  Citys: string[] = [];
  filteredCitys!: Observable<any[]>;
  selectedState: string = '';
  selectedCity: string = '';
  fullState: string | undefined;

  ngOnInit() {

    this.filteredCitys = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value:any) => 
        from( this.placesService.getPlaces(value)).pipe(
        map((response:any)=> response.predictions.map((item:any)=> {
          const city = item.terms[0].value;
          const state = item.terms[1].value;
          console.log(state);
          return {city,state};
        })),
        catchError(()=>of([]))
      )
    )
    );
   
  }

  onCitySelected(city: any){
    this.selectedCity = city.city;
    this.selectedState = city.state;
    this.City.nativeElement.value = this.selectedCity;
    this.fullState = this.findState(this.selectedState);
  }

  findState(key: string){
    var state = Object.keys(this.states).find(state => this.states[state] === key);
    console.log(state);
    return state;
    }
  toggleClass(){
  if (this.City.nativeElement.value === '') {
    this.renderer.addClass(this.City.nativeElement, 'is-invalid');
  }else if (this.City.nativeElement.value !== '') {
    this.renderer.removeClass(this.City.nativeElement, 'is-invalid');
  }
  }

  checkFormInputs(){
    if (this.City.nativeElement.value === '') {
      this.renderer.addClass(this.City.nativeElement, 'is-invalid');
    }
  }
}
