import { TestBed } from '@angular/core/testing';

import { GlobalStateManagerService } from './global-state-manager.service';

describe('GlobalStateManagerService', () => {
  let service: GlobalStateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
