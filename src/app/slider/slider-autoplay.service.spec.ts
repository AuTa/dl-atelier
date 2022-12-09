import { TestBed } from '@angular/core/testing';

import { SliderAutoplayService } from './slider-autoplay.service';

describe('SliderAutoplayService', () => {
  let service: SliderAutoplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SliderAutoplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
