import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarDeterminateExampleComponent } from './progress-bar-determinate-example.component';

describe('ProgressBarDeterminateExampleComponent', () => {
  let component: ProgressBarDeterminateExampleComponent;
  let fixture: ComponentFixture<ProgressBarDeterminateExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarDeterminateExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressBarDeterminateExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
