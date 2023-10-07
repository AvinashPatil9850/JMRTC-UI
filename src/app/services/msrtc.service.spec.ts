import { TestBed } from '@angular/core/testing';

import { MsrtcService } from './msrtc.service';

describe('MsrtcService', () => {
  let service: MsrtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsrtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
