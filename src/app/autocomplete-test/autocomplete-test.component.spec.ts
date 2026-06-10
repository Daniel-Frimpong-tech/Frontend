import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteComponentTest } from './autocomplete-test.component';

describe('AutocompleteComponentTest', () => {
  let component: AutocompleteComponentTest;
  let fixture: ComponentFixture<AutocompleteComponentTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponentTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponentTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
