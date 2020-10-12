import { TestBed } from '@angular/core/testing';

import { PopUpsService } from './popups.service';

describe('PopupsService', () => {
  let service: PopUpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
