import { TestBed } from '@angular/core/testing';

import { TomorrowioService } from './tomorrowio.service';

describe('TomorrowioService', () => {
  let service: TomorrowioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TomorrowioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
