import { TestBed } from '@angular/core/testing';

import { TithesService } from './tithes.service';

describe('TithesService', () => {
  let service: TithesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TithesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
