import { Component, ElementRef, Renderer2, ViewChild,AfterViewInit} from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { AutocompleteComponentTest } from '../autocomplete-test/autocomplete-test.component';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [AutocompleteComponent, AutocompleteComponentTest],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements AfterViewInit {
  @ViewChild('street') street!: ElementRef;
  @ViewChild('form') form!: ElementRef;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;
  @ViewChild(AutocompleteComponentTest) autocompleteTest!: AutocompleteComponentTest;



  constructor(
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(){
    this.autocompleteTest.City.nativeElement.optionSelected.subscribe(()=>{
      console.log(this.autocompleteTest.fullState);
      this.autocomplete.state.nativeElement.value = this.autocompleteTest.fullState;
    });
    
  }

  validateStreet(){
    if (this.street.nativeElement.value === '') {
      this.renderer.addClass(this.street.nativeElement, 'is-invalid');
  }else if (this.street.nativeElement.value !== '') {
    this.renderer.removeClass(this.street.nativeElement, 'is-invalid');
  }
}



  checkFormInputs(){
    if (this.street.nativeElement.value !==''){
      this.renderer.removeClass(this.street.nativeElement, 'is-invalid');
    }
    if(this.autocomplete.state.nativeElement.value !== ''){
      this.renderer.removeClass(this.autocomplete.state.nativeElement, 'is-invalid');
  }
}
  
}
